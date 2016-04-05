angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.controller('MMUIPageCtrl', ['$scope', function($scope) {
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

.controller('MMUIOrderListCtrl', ['$scope', '$filter', '$window', 'OrderService', 'Encounter',
	function($scope, $filter, $window, OrderService, Encounter) {

		$scope.allDrugOrders = [];
		$scope.config = $window.config;

		OrderService.getOrders({
			t: 'drugorder',
			v: 'full',
			patient: $scope.config.patient.uuid,
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
						currentOrder.visit = {"uuid":""};
					}
				});
			});	
		});

	}
	]);