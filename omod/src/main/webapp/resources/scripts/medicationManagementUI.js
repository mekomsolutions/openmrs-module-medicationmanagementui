angular.module('MedicationManagementUI', ['orderService','drugOrders'])

.controller('MMUIPageCtrl', ['$scope', '$window', function($scope, $window) {

	$scope.config = $window.OpenMRS.drugOrdersConfig;
}])

.controller('MMUIOrderListCtrl', ['$scope', '$window', '$q', 'OrderService', 'DrugOrderModelService',
	function($scope, $window, $q, OrderService, DrugOrderModelService) {

		$scope.activeDrugOrders = {loading: true};
		$scope.pastDrugOrders = {loading: true};;
		$scope.allDrugOrders = {loading: true};;

		// define a custom representation of an Order, so to retrieve the full encounter
		customRep = 'custom:(action:ref,asNeeded:ref,asNeededCondition:ref,auditInfo:ref,autoExpireDate:ref,brandName:ref,careSetting:ref,commentToFulfiller:ref,concept:ref,dateActivated:ref,dateStopped:ref,dispenseAsWritten:ref,display:ref,dose:ref,doseUnits:ref,dosingInstructions:ref,dosingType:ref,drug:ref,duration:ref,durationUnits:ref,encounter:full,frequency:ref,instructions:ref,numRefills:ref,orderNumber:ref,orderReason:ref,orderReasonNonCoded:ref,orderer:ref,patient:ref,previousOrder:ref,quantity:ref,quantityUnits:ref,route:ref,urgency:ref,uuid:ref,links:ref';

		$scope.config = $window.OpenMRS.drugOrdersConfig;

		$scope.promiseArray = [];

		$scope.loadData = function() {

			$scope.loading = true;

			$scope.promiseArray.push(
				OrderService.getOrders({
					patient: $scope.config.patient.uuid,
					t: 'drugorder',
					v: customRep,
					careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0",
					status: 'active'
				}).then(function(orders) {
					$scope.activeDrugOrders = DrugOrderModelService.wrapOrders(orders);
				})
				);

			$scope.promiseArray.push(
				OrderService.getOrders({
					patient: $scope.config.patient.uuid,
					t: 'drugorder',
					v: customRep,
					careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0",
					status: 'inactive'
				}).then(function(orders) {
					$scope.pastDrugOrders = DrugOrderModelService.wrapOrders(orders);
				})
				);


			// We store all the promises in an array and apply logic when they are all resolved
			$q.all($scope.promiseArray).then(function() {
				$scope.allDrugOrders = $scope.activeDrugOrders.concat($scope.pastDrugOrders);
				$scope.allDrugOrders = getRevisions($scope.allDrugOrders);

				$scope.loading = false;				
			})
		}

		$scope.loadData();


		function getRevisions(orders) {

			var ordersMap = {};

			orders.forEach(function(order) {
				if (order.previousOrder != null) {
					ordersMap[order.uuid] = order.previousOrder.uuid;
				}
			});

			orders.forEach(function(order, index) {
				var revisions = [];

				while (order.uuid in ordersMap) {
					// order.previousOrder returns only a 'ref' to the previousOrder, not the 'full' object
					// so we have to retrieve the complete object from the 'orders' list, based on its UUID
					
					for (var i=0; i < orders.length; i++ ) {
						if (ordersMap[order.uuid] == orders[i].uuid) {
							order = orders[i];
							revisions.push(order);
						}
					}
				}

				orders[index].revisions = revisions;

			})
			return orders;
		}
	}
	])

.filter('active', function () {
	return function (items, isActive) {

		isActive = isActive || true;
		var itemsToReturn = [];

		if (typeof isActive === 'undefined') {
			isActive = true;
		}

		if (items === undefined) return itemsToReturn;

		for (var i = 0; i < items.length ; i++) {
			var item = items[i];
			if (item.isActive() != null) {
				if (item.isActive() == isActive) {
					itemsToReturn.push(item);
				}
			} 		
		}
		return itemsToReturn;
	}
})

.filter('visit', function () {
	return function (items, visit) {

		if (visit === null || typeof visit === 'undefined') {
			return items
		};

		var itemsToReturn = [];

		if (items === undefined) return itemsToReturn;

		for (var i = 0; i < items.length ; i++) {
			var item = items[i];
			if (item.encounter.visit != null) {
				if (item.encounter.visit.uuid == visit.uuid) {
					itemsToReturn.push(item);
				}
			} 		
		}
		return itemsToReturn;
	}
})

.controller('MMUIOrderTemplate', ['$scope', '$filter',
	function($scope, $filter) {


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
	])

.factory('DrugOrderModelService', function(){

	function wrapOrders (orders){

		var map = {};
		map = _.map(orders, function(item) { 
			item = new OpenMRS.DrugOrderModel(item);
			return item  
		});		
		return map;
	};

	return {wrapOrders:wrapOrders};
});