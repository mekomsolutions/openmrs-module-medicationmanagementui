angular.module('MedicationManagementUI', ['orderService'])

.controller('MMUIPageCtrl', ['$scope', '$window', function($scope, $window) {

	$scope.config = $window.config;
}])

.controller('MMUIOrderListCtrl', ['$scope', '$window', '$q', 'OrderService',
	function($scope, $window, $q, OrderService) {

		$scope.activeDrugOrders = [];
		$scope.pastDrugOrders = [];
		$scope.allDrugOrders = [];
		
		$scope.promiseArray = [];

		$scope.config = $window.config;

		$scope.promiseArray.push(
			OrderService.getOrders({
				patient: $scope.config.patient.uuid,
				t: 'drugorder',
				v: 'custom:(uuid,previousOrder:ref,display,careSetting:ref,orderType,orderNumber,patient:ref,concept:ref,instructions:ref,dateActivated:ref,dateStopped:ref,encounter:full)',
				careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0",
				status: 'active'
			}).then(function(orders) {
				$scope.activeDrugOrders = orders;
			})
			);

		$scope.promiseArray.push(
			OrderService.getOrders({
				patient: $scope.config.patient.uuid,
				t: 'drugorder',
				v: 'custom:(uuid,previousOrder:ref,display,careSetting:ref,orderType,orderNumber,patient:ref,concept:ref,instructions:ref,dateActivated:ref,dateStopped:ref,encounter:full)',
				careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0",
				status: 'inactive'
			}).then(function(orders) {
				$scope.pastDrugOrders = orders;
			})
			);


		// We store all the promises in an array and apply logic when they are all resolved
		$q.all($scope.promiseArray).then(function() {
			$scope.allDrugOrders = $scope.activeDrugOrders.concat($scope.pastDrugOrders);
			$scope.allDrugOrders = getRevisions($scope.allDrugOrders);
		})


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
					debugger;
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

.controller('MMUIOrderTemplate', ['$scope',
	function($scope) {


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