angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.controller('MMUIPageCtrl', ['$scope', '$filter',
	function($scope, $filter) {

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

.controller('MMUIOrderListCtrl', ['$scope', '$filter', 'OrderService',
	function($scope, $filter, OrderService) {

		$scope.loadExistingOrders = function() {

			OrderService.getOrders({
				t: 'drugorder',
				v: 'full',
				patient: OpenMRS.drugOrdersConfig.patient.uuid,
				careSetting: '6f0c9a92-6f24-11e3-af88-005056821db0'
			}).then(function(results) {
				$scope.activeDrugOrders = results;
				if (typeof OpenMRS.drugOrdersConfig.visit == "undefined") {
					$scope.drugOrders = $filter('filterByVisit')($scope, $scope.activeDrugOrders);
				} else {
					$scope.drugOrders = $filter('filterByVisit')($scope, $scope.activeDrugOrders, OpenMRS.drugOrdersConfig.visit.uuid);
				}
			});
		};

		$scope.loadExistingOrders();
		$scope.visit = OpenMRS.drugOrdersConfig.visit;

	}
	])

.filter('filterByVisit', ['Encounter', function(Encounter) {
	return function($scope, orders, visit) {
		var encounterType = config.orderEncounterType;

		var encounters = [];
		var visits = {};
		var filtered = [];

		if (orders.length > 0) {
			orders.forEach(function(currentOrder, index) {
				Encounter.get({
					uuid: currentOrder.encounter.uuid
				}).$promise.then(function(encounter) {
					if (encounter.visit != null) {
						currentOrder.visit = encounter.visit;
					}

					if (visit != null) {
						if (currentOrder.visit != null && currentOrder.visit.uuid == visit) {
							filtered.push(currentOrder);
						}
					} else {
						filtered.push(currentOrder);
					}
				});

			});
		}

		return filtered;
	}
}])
