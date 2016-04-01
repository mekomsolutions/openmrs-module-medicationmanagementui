angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.controller('MMUIPageCtrl', ['$scope', '$filter',
	function($scope, $filter) {
		$scope.value = 4;
	}
])


.directive('mmuiOrders', function() {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: 'templates/orders-list.page',
		controller: 'MMUIOrderListCtrl'

	};
})

.controller('MMUIOrderListCtrl', ['$scope', '$filter', 'OrderService', 'Encounter',
	function($scope, $filter, OrderService, Encounter) {


		$scope.loadExistingOrders = function() {

			$scope.allDrugOrders = [];
			$scope.visit = OpenMRS.drugOrdersConfig.visit;

			OrderService.getOrders({
				t: 'drugorder',
				v: 'full',
				patient: OpenMRS.drugOrdersConfig.patient.uuid,
				careSetting: '6f0c9a92-6f24-11e3-af88-005056821db0'
			}).then(function(results) {
				$scope.allDrugOrders = results;

				$scope.allDrugOrders.forEach(function(currentOrder, index) {
					Encounter.get({
						uuid: currentOrder.encounter.uuid
					}).$promise.then(function(encounter) {
						if (encounter.visit != null) {
							currentOrder.visit = encounter.visit;
						} else {
							currentOrder.visit = {
								"uuid": ""
							};
						}
					});
				});
			});
		};

		$scope.loadExistingOrders();

	}
])