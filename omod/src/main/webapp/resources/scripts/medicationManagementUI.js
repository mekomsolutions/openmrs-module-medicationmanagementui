angular.module('MedicationManagementUI', [])

.directive('mmuiOrders', function () {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: 'templates/orders-list.page',
		controller: function () {
			
			// TODO: retrieve the list of all orders
			this.allOrders = ["1","2"];
		},
		controllerAs: 'orders'

	};
})
