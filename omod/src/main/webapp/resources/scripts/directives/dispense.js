angular.module('MedicationManagementUI.dispense', ['obsService', 'encounterService'])

.controller('MMUIDispenseConfigInitializer', ['$scope', '$window', function ($scope, $window) {

	$scope.dispenseConfig = $window.dispenseConfig;
}
])

.directive('mmuiDispense', ['$rootScope', '$timeout', 'Encounter', 'ObsService', 'Obs',
	function($rootScope, $timeout, Encounter, ObsService, Obs) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				orderConfig: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/dispenseTemplate.page',

			link: function(scope, element, attrs) {

				scope.$on("toggleDispense", function () {
					scope.quantity = "";
					scope.quantityUnit = "";

					scope.showDirective = !scope.showDirective;
				});

				var previousObservations = [];
				var previousDispenseObservations = [];

				var pastDrugObs = {};
				var pastDoseObs = {};
				var pastUnitObs = {};

				scope.loading = false;

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

				scope.createDispense = function () {

					/* Disable save button once clicked */
					scope.loading = true;

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

							/* if it is successfully saved, then delete previous observations */
							_.map(previousDispenseObservations, function (obs) {
								Obs.delete({
									uuid: obs.uuid
								});
							});

							/* broadcast a events */
							$rootScope.$broadcast('dispensed');
							scope.$broadcast('toggleDispense');

							scope.loading = false;

						});

					})
				}
			}
		}
	}
	])

.directive('mmuiDispenseTag', ['$rootScope', 'ObsService',
	function($rootScope, ObsService) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				orderConfig: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/dispenseTagTemplate.page',

			link: function(scope, element, attrs) {

				scope.loadDispenseData = function () {

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

				scope.loadDispenseData();

				$rootScope.$on('dispensed', function () {
					scope.loadDispenseData();
				})

			}
		}
	}
	])


