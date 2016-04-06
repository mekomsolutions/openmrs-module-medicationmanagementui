angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.controller('MMUIPageCtrl', ['$scope', function($scope) {}])

.controller('MMUIOrderListCtrl', ['$scope', '$window', 'OrderService', 'EncounterService',
	function($scope, $window, OrderService, EncounterService) {

		$scope.config = $window.config;

		$scope.allDrugOrders = [];
		var allDrugOrdersEncounters = [];

		OrderService.getOrders({
			t: 'drugorder',
			v: 'full',
			patient: $scope.config.patient.uuid,
			careSetting: '6f0c9a92-6f24-11e3-af88-005056821db0'
		}).then(function(orders) {
			$scope.allDrugOrders = orders;

			// TODO: Replace the encounterType by the one used by the OrderEntry module
			EncounterService.getEncounters({
				v: 'full',
				patient: $scope.config.patient.uuid,
				encounterType: 'e22e39fd-7db2-45e7-80f1-60fa0d5a4378'
			}).then(function(encounters) {
				allDrugOrdersEncounters = encounters;

				$scope.allDrugOrders.forEach(function(currentOrder, index) {

					allDrugOrdersEncounters.forEach(function(currentEncounter, index) {

						if (currentEncounter.uuid == currentOrder.encounter.uuid) {
							if (currentEncounter.visit != null) {
								currentOrder.visit = currentEncounter.visit;
							} else {
								currentOrder.visit = {
									uuid: ""
								};
							}
						}
					})
				})
			});
		});
	}
	])

.controller('MMUIOrderDetails', ['$scope', '$window', 'OrderService', 'EncounterService',
	function($scope, $window, OrderService, EncounterService) {


		$scope.redirectToDispense = function(orderUuid) {
			console.log("should redirect to Dispense");
			console.log(orderUuid);
		};

		$scope.redirectToRevise = function(orderUuid) {
			console.log("should redirect to Revise");
			console.log(orderUuid);
		};

		$scope.redirectToAdministration = function(orderUuid) {
			console.log("should redirect to Revise");
			console.log(orderUuid);
		};

	}
	]);