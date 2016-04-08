angular.module('MedicationManagementUI', ['orderService', 'encounterService'])

.controller('MMUIPageCtrl', ['$scope', function($scope) {}])

.controller('MMUIOrderListCtrl', ['$scope', '$window', 'OrderService',
	function($scope, $window, OrderService) {

		$scope.config = $window.config;

		$scope.allDrugOrders = [];

		OrderService.getOrders({
			t: 'drugorder',
			v: 'custom:(uuid,display,orderType,orderNumber,patient:ref,concept:ref,instructions:ref,dateActivated:ref,encounter:full)',
			patient: $scope.config.patient.uuid
		}).then(function(orders) {
			$scope.allDrugOrders = orders;
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