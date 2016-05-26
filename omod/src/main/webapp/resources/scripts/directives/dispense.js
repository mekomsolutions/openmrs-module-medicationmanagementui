angular.module('MedicationManagementUI.dispense', [])

.controller('MMUIDispenseConfigInitializer', ['$scope', '$window', function ($scope, $window) {

	$scope.dispenseConfig = $window.dispenseConfig;

}
])

.directive('mmuiDispense', ['$rootScope', '$window', '$filter','SessionInfo', 'OrderEntryService', 'Encounter',
	function($rootScope, $window, $filter, SessionInfo, OrderEntryService, Encounter) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				orderConfig: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/dispenseTemplate.page',

			link: function(scope, element, attrs) {


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

					/* create encounter, or retrieve existing one */
					var encounter = {};

					if (scope.order.dispenseEncounter) {
						encounter.uuid = scope.dispenseConfig.dispenseEncounter.uuid;
						encounter.previousObs = scope.order.dispenseEncounter.obs;
						encounter.location = uuidIfNotNull(scope.orderConfig.location);
					} else {
						encounter.encounterType = scope.dispenseConfig.dispenseEncounterType;
						encounter.patient = scope.dispenseConfig.patient.uuid;
						encounter.visit = uuidIfNotNull(scope.orderConfig.visit);
						encounter.location = uuidIfNotNull(scope.orderConfig.location);
					}

					/* create dispense observation */
					encounter.obs = []

					var drugObservation = {
						order: scope.order.uuid,
						concept: scope.dispenseConfig.medicationDispenseConcept.uuid,
						value: scope.order.concept.uuid
					}
					var doseObservation = {
						order: scope.order.uuid,
						concept: scope.dispenseConfig.qtyDispenseConcept.uuid,
						value: scope.quantity
					}
					var unitObservation = {
						order: scope.order.uuid,
						concept: scope.dispenseConfig.qtyUnitsDispenseConcept.uuid,
						value: scope.quantityUnit.uuid
					}

					encounter.obs.push(drugObservation,doseObservation,unitObservation);

					Encounter.save(encounter).$promise.then(function (results) {
						/* broadcast a reload event */
						$rootScope.$broadcast('relaodOrders');
						console.log(results);
					});
				}
			}
		}
	}
	])

.directive('mmuiDispenseTag', ['EncounterService', 'ObsService',
	function(EncounterService, ObsService) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				orderConfig: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/dispenseTagTemplate.page',

			link: function(scope, element, attrs) {

				ObsService.getObs({
					patient: scope.config.patient.uuid,
					order: scope.order.uuid
				}).then(function (results) {
					orderObservations = results;

					dispenseObs = _.filter(orderObservations, function (obs) {
						obs.concept == scope.config.dispenseConcepts
						return 
					})


				})
			}
		}
	}
	])


.filter('mostRecentDispense', function () {
	return function (observations, dispenseConcepts) {
		
		var mostRecentDispense = _.filter(observations, function (obs) {
			return obs.order.uuid == order.uuid
		});

		return latestDispense;
	}

})
