angular.module('MedicationManagementUI.dispense', [])

.directive('mmuiDispense', ['$rootScope', '$window', '$filter','SessionInfo', 'OrderEntryService', 'Encounter',
	function($rootScope, $window, $filter, SessionInfo, OrderEntryService, Encounter) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				config: '='
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
						encounter.uuid = scope.order.dispenseEncounter.uuid;
						encounter.previousObs = scope.order.dispenseEncounter.obs;
						encounter.location = uuidIfNotNull(scope.config.location);
					} else {
						encounter.encounterType = scope.config.dispenseEncounterType;
						encounter.patient = scope.config.patient.uuid;
						encounter.visit = uuidIfNotNull(scope.config.visit);
						encounter.location = uuidIfNotNull(scope.config.location);
					}

					/* create dispense observation */
					encounter.obs = []

					var drugObservation = {
						order: scope.order.uuid,
						concept: "1282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
						value: scope.order.concept.uuid
					}
					var doseObservation = {
						order: scope.order.uuid,
						concept: "160856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
						value: scope.quantity
					}
					var unitObservation = {
						order: scope.order.uuid,
						concept: "161563AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
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
				config: '='
			},
			templateUrl: 'templates/dispenseTagTemplate.page',

			link: function(scope, element, attrs) {

				ObsService.getObs({
					patient: scope.config.patient.uuid,
					order: scope.order.uuid
				}).then(function (results) {
					scope.dispenseObservations = results;
				})
			}
		}
	}
	])
