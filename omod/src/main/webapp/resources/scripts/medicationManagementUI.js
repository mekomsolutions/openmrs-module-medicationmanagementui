angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.directive('mmuiOrders', function() {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: 'templates/orders-list.page',
		controller: 'MMUIOrdersCtrl'

	};
})

.controller('MMUIOrdersCtrl', ['$scope', '$filter', 'OrderService',
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

	}
	])

.filter('filterByVisit', ['Encounter', function(Encounter) {
	return function($scope, orders, visit) {
		var encounterType = config.orderEncounterType;

		var encounters = [];
		var visits = {};
		var filtered = [];

		if (orders.length == 0) {

		} else if (visit != null ) {
			for (var i = 0; i < orders.length; i++) {

				var order;
				order = orders[i];

				Encounter.get({
					uuid: order.encounter.uuid
				}).$promise.then( function (encounter) {
					if (encounter.visit.uuid == visit && encounter.visit != null) {
						order.visit = encounter.visit; 
						filtered.push(order);	
					}
				})
			};
		} else {
			return orders;
		}

		return filtered;
	}
}])