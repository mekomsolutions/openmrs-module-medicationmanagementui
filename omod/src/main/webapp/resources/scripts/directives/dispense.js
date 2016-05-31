angular.module('MedicationManagementUI.dispense', ['obsService'])

.controller('MMUIDispenseConfigInitializer', ['$scope', '$window', function ($scope, $window) {

	$scope.dispenseConfig = $window.dispenseConfig;
}
])

.directive('mmuiDispense', ['$rootScope', '$window', '$filter','SessionInfo', 'OrderEntryService', 'Encounter', 'ObsService', 'Obs',
	function($rootScope, $window, $filter, SessionInfo, OrderEntryService, Encounter, ObsService, Obs) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				orderConfig: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/dispenseTemplate.page',

			link: function(scope, element, attrs) {

				/* Retrieve  previous observations */

				var previousObservations = [];
				var previousDispenseObservations = [];

				var pastDrugObs = {};
				var pastDoseObs = {};
				var pastUnitObs = {};

				function replaceWithUuids(obj, props) {
					var replaced = angular.extend({}, obj);
					_.each(props, function(prop) {
						if (replaced[prop] && replaced[prop].uuid) {
							replaced[prop] = replaced[prop].uuid;
						}
					});
					return replaced;
				}

				function uuidIfNotNull(obj) {
					return obj ? obj.uuid : null;
				}

				scope.quantity = "";
				scope.quantityUnit = "";

				scope.createDispense = function () {

					var voidObs = ObsService.getObs({
						v:'custom:(encounter:full,concept:ref,uuid:ref)',
						patient: scope.order.patient.uuid,
						order: scope.order.uuid,
					})

					voidObs.then(function (results) {
						previousObservations = results;

						previousDispenseObservations = _.filter(previousObservations, function (obs) {
							return obs.encounter.encounterType.uuid == dispenseConfig.dispenseEncounterType.uuid;
						})

						pastDrugObs = _.find(previousDispenseObservations, function (obs) {
							return obs.concept.uuid == dispenseConfig.medicationDispenseConcept.uuid
						});

						pastDoseObs = _.find(previousDispenseObservations, function (obs) {
							return obs.concept.uuid == dispenseConfig.qtyDispenseConcept.uuid
						});

						pastUnitObs = _.find(previousDispenseObservations, function (obs) {
							return obs.concept.uuid == dispenseConfig.qtyUnitDispenseConcept.uuid
						});

						_.map(previousDispenseObservations, function (obs) {
							Obs.delete({
								uuid: obs.uuid
							});
						});
						
					});
					
					voidObs.then(function () {
						/* create encounter, or retrieve existing one */
						var encounter = {};

						if (pastDrugObs) {
							encounter.uuid = uuidIfNotNull(pastDrugObs.encounter);
						}
						encounter.encounterType = scope.dispenseConfig.dispenseEncounterType.uuid;
						encounter.patient = scope.orderConfig.patient.uuid;
						encounter.visit = uuidIfNotNull(scope.orderConfig.visit);
						encounter.location = uuidIfNotNull(scope.orderConfig.location);
						encounter.provider = scope.orderConfig.provider.person;

						/* create dispense observation */
						encounter.obs = []

						var drugObs = {
							order: scope.order.uuid,
							concept: scope.dispenseConfig.medicationDispenseConcept.uuid,
							value: scope.order.concept.uuid
						}
						var doseObs = {
							order: scope.order.uuid,
							concept: scope.dispenseConfig.qtyDispenseConcept.uuid,
							value: scope.quantity
						}
						var unitObs = {
							order: scope.order.uuid,
							concept: scope.dispenseConfig.qtyUnitDispenseConcept.uuid,
							value: scope.quantityUnit.uuid
						}

						var currentDispenseObservations = [];
						currentDispenseObservations.push(drugObs, doseObs, unitObs);

						encounter.obs.push(drugObs,doseObs,unitObs);

						Encounter.save(encounter).$promise.then(function (results) {
							/* broadcast a reload event */
							$rootScope.$broadcast('reloadOrders');
						});
					})
				}
			}
		}
	}
	])

.directive('mmuiDispenseTag', ['ObsService',
	function(ObsService) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				orderConfig: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/dispenseTagTemplate.page',

			link: function(scope, element, attrs) {

				var orderObservations = [];

				ObsService.getObs({
					v:'custom:(order:ref,value:ref,concept:ref)',
					patient: scope.order.patient.uuid,
					order: scope.order.uuid
				}).then(function (results) {
					orderObservations = results;

					scope.dispenseObservations = orderObservations;

					scope.qtyDispenseObs = _.find(orderObservations, function (obs) {
						return obs.concept.uuid == dispenseConfig.qtyDispenseConcept.uuid
					});

					scope.qtyUnitsDispenseObs = _.find(orderObservations, function (obs) {
						return obs.concept.uuid == dispenseConfig.qtyUnitDispenseConcept.uuid
					});


				})
			}
		}
	}
	])


