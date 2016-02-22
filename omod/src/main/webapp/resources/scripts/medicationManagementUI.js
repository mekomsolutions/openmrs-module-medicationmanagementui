angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.directive('mmuiOrders', function () {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: 'templates/orders-list.page',
		controller: 'mmuiOrdersCtrl'

	};
})

.controller('mmuiOrdersCtrl', ['$scope', '$filter', 'OrderService',
                               function($scope, $filter, OrderService) {

	loadExistingOrders();

	function loadExistingOrders() {
		OrderService.getOrders({
			t: 'drugorder',
			v: 'full',
			patient: config.patient.uuid,
			careSetting: '6f0c9a92-6f24-11e3-af88-005056821db0'
		}).then(function(results) {
			$scope.activeDrugOrders = results;
			$scope.visitDrugOrders = $filter('filterByVisit')($scope.activeDrugOrders, OpenMRS.drugOrdersConfig.visit.uuid);
		});
	};

}])

.filter('filterByVisit', ['EncounterService', function(EncounterService) {
	return function (orders, visit) {

		var encounterType = config.orderEncounterType;

		var encounters = [];
		var visits = {};
		
		for (var i = 0; i < orders.length; i++) {

			var order = [];
			order = orders[i]; 
			console.log(order.encounter.uuid);

			// TODO: The request returns undefined objects, even if the response is code 200 and seem valid
			EncounterService.getEncounters({
				uuid: order.encounter.uuid
			}).then(function(results) {
				console.log(results);
			});
		};

		var filtered = [];
		filtered.push(orders[0]);


		return filtered;
	}
}])
