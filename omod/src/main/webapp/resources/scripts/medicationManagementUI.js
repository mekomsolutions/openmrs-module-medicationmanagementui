angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.controller('MMUIPageCtrl', ['$scope', '$window', function($scope, $window) {

	$scope.config = $window.config;
}])

.controller('MMUIOrderListCtrl', ['$scope', '$window', '$q', 'OrderService',
	function($scope, $window, $q, OrderService) {

		$scope.activeDrugOrders = [];
		$scope.allDrugOrders = [];
		$scope.pastDrugOrders = [];

		$scope.promiseArray = [];

		$scope.promiseArray.push(
			OrderService.getOrders({
				patient: $scope.config.patient.uuid,
				t: 'drugorder',
				v: 'custom:(uuid,previousOrder:ref,display,careSetting:ref,orderType,orderNumber,patient:ref,concept:ref,instructions:ref,dateActivated:ref,dateStopped:ref,encounter:full)',
				careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0"
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


		/**
		 * Finds the replacement order for a given active order (e.g. the order that will DC or REVISE it)
		 */
		$scope.replacementFor = function(activeOrder) {
			var lookAt = $scope.newDraftDrugOrder ?
				_.union($scope.draftDrugOrders, [$scope.newDraftDrugOrder]) :
				$scope.draftDrugOrders;
			return _.findWhere(lookAt, {
				previousOrder: activeOrder
			});
		}

		$scope.replacementForPastOrder = function(pastOrder) {
			var candidates = _.union($scope.activeDrugOrders, $scope.pastDrugOrders)
			return _.find(candidates, function(item) {
				return item.previousOrder && item.previousOrder.uuid === pastOrder.uuid;
			});
		}

		function getRevisions(orders) {

			var ordersMap = {};

			orders.forEach(function(order) {
				if (order.previousOrder != null) {
					ordersMap[order.uuid] = order.previousOrder.uuid;
				}
			});

			orders.forEach(function(order, index) {
				var revisions = [];

				while (order.previousOrder != null) {
					
					// order.previousOrder returns only a 'ref' to the previousOrder, not the 'full' object
					// so we have to retrieve the complete object from the 'orders' list, based on its UUID
					order = orders.find(function(item) {
						return item.uuid === order.previousOrder.uuid;
					});
					revisions.push(order);
				}

				orders[index].revisions = revisions;

			})

			return orders;

		}

	}
])

.controller('MMUIOrderTemplate', ['$scope', '$window', 'OrderService', 'EncounterService',
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