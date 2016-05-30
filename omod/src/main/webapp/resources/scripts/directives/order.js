angular.module('MedicationManagementUI.order',[])

.directive('mmuiOrder', [ '$window', '$filter','SessionInfo', 'OrderEntryService',
	function($window, $filter,SessionInfo,OrderEntryService) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				config: '=',
				dispenseConfig: '='
			},
			templateUrl: 'templates/orderTemplate.page',

			link: function(scope, element, attrs) {

				var orderContext = {};
				SessionInfo.get().$promise.then(function(info) {
					orderContext.provider = info.currentProvider;
				});


				scope.discontinueOrder = function() {

					var dcOrder = scope.order.createDiscontinueOrder(orderContext);
					dcOrder.action = "DISCONTINUE";
					var dcOrders = [];
					dcOrders.push(dcOrder);

					var encounterContext = {
						patient: scope.config.patient,
						encounterType: scope.config.drugOrderEncounterType,
						location: null,
						visit: scope.config.visit
					};

					scope.discontinue = {loading : "true"};
					OrderEntryService.signAndSave({ draftOrders: dcOrders }, encounterContext)
					.$promise.then(function(result) {
						location.href = location.href;
					}, function(errorResponse) {
						emr.errorMessage(errorResponse.data.error.message);
						scope.discontinue.loading = false;
					});

				}
			}
		}
	},
	])
