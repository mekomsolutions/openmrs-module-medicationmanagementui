angular.module('MedicationManagementUI', ['orderService', 'encounterService','drugOrders','session'])

.controller('MMUIPageCtrl', ['$scope', '$window', function($scope, $window) {

	$scope.config = $window.OpenMRS.drugOrdersConfig;
	$scope.careSettings = $scope.config.careSettings;
	$scope.careSetting = $scope.config.intialCareSetting ?
	_.findWhere(config.careSettings, { uuid: config.intialCareSetting }) :
	$scope.config.careSettings[0];

	$scope.buildCreateOrderUrl = function() {		
		$scope.config.createOrderUrl = $scope.config.orderEntryUiUrl + "&mode=new" + "&skipDispense=true" + "&careSetting=" + $scope.careSetting.uuid;
	}
	$scope.buildCreateOrderUrl();

	$scope.setCareSetting = function(careSetting) {
		/* TODO confirm dialog or undo functionality if this is going to discard things */
		$scope.careSetting = careSetting;
		$scope.buildCreateOrderUrl();
	}

}])

.controller('MMUIOrderListCtrl', ['$scope', '$window', '$q', 'OrderService', 'DrugOrderModelService',
	function($scope, $window, $q, OrderService, DrugOrderModelService) {

		/* define a custom representation of an Order, so to retrieve the full encounter */
		customRep = 'custom:(action:ref,asNeeded:ref,asNeededCondition:ref,autoExpireDate:ref,brandName:ref,careSetting:ref,commentToFulfiller:ref,concept:ref,dateActivated:ref,dateStopped:ref,dispenseAsWritten:ref,display:ref,dose:ref,doseUnits:ref,dosingInstructions:ref,dosingType:ref,drug:ref,duration:ref,durationUnits:ref,encounter:full,frequency:ref,instructions:ref,numRefills:ref,orderNumber:ref,orderReason:ref,orderReasonNonCoded:ref,orderer:ref,patient:ref,previousOrder:ref,quantity:ref,quantityUnits:ref,route:ref,urgency:ref,uuid:ref,links:ref';

		$scope.config = $window.OpenMRS.drugOrdersConfig;

		$scope.promiseArray = [];

		$scope.loadData = function() {

			$scope.activeDrugOrders = [];
			$scope.pastDrugOrders = [];
			$scope.allDrugOrders = [];

			$scope.loading = true;

			for (var i=0; i < $scope.careSettings.length ; i++) {

				$scope.promiseArray.push(
					OrderService.getOrders({
						patient: $scope.config.patient.uuid,
						t: 'drugorder',
						v: customRep,
						careSetting: $scope.careSettings[i].uuid,
						status: 'active'
					}).then(function(results) {

						/* get the revision URL of each active order */
						for (var i=0; i < results.length; i++ ) { 
							results[i] = setReviseUrl(results[i]);
							results[i] = setDispenseUrl(results[i]);
						} 
						$scope.activeDrugOrders = results.concat($scope.activeDrugOrders);
						$scope.activeDrugOrders = DrugOrderModelService.wrapOrders($scope.activeDrugOrders);
					})
					);

				$scope.promiseArray.push(
					OrderService.getOrders({
						patient: $scope.config.patient.uuid,
						t: 'drugorder',
						v: customRep,
						careSetting: $scope.careSettings[i].uuid,
						status: 'inactive'
					}).then(function(results) {
						$scope.pastDrugOrders = results.concat($scope.pastDrugOrders);
						$scope.pastDrugOrders = DrugOrderModelService.wrapOrders($scope.pastDrugOrders);
					})
					);
			}

			/* We store all the promises in an array and apply logic when they are all resolved */
			$q.all($scope.promiseArray).then(function() {
				
				$scope.allDrugOrders = $scope.activeDrugOrders.concat($scope.pastDrugOrders);
				$scope.allDrugOrders = getRevisions($scope.allDrugOrders);

				$scope.loading = false;				
			})
		}

		$scope.loadData();

		function getRevisions(orders) {

			var ordersMap = {};

			orders.forEach(function (order) {
				if (order.previousOrder != null) {
					ordersMap[order.uuid] = order.previousOrder.uuid;
				}
			});

			orders.forEach(function (order, index) {
				var revisions = [];

				while (order.uuid in ordersMap) {
					/* order.previousOrder returns only a 'ref' to the previousOrder, not the 'full' object */
					/* so we have to retrieve the complete object from the 'orders' list, based on its UUID */
					
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

		function setReviseUrl (order) {
			order.reviseUrl = $scope.config.orderEntryUiUrl + "&order=" + order.uuid + "&mode=revise"  + "&skipDispense=true";
			return order;
		}

		function setDispenseUrl (order) {
			order.dispenseUrl = $scope.config.medicationDispenseUrl + "&order=" + order.uuid;
			return order;
		}

	}
	])

.filter('active', function () {
	return function (items, isActive) {
		
		if (items.length == 0) {
			return items;
		}

		var itemsToReturn = [];

		if (typeof isActive === 'undefined') {
			isActive = true;
		}

		if (items === undefined) return itemsToReturn;

		for (var i = 0; i < items.length ; i++) {
			var item = items[i];

			if (item.isActive() != null || !(typeof item.isActive() === 'undefined') ) {
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

.filter('careSetting', function () {
	return function (items, careSetting) {
		
		var itemsToReturn = [];

		for (var i = 0; i < items.length ; i++) {
			var item = items[i];
			if (item.careSetting != null) {
				if (item.careSetting.uuid == careSetting.uuid) {
					itemsToReturn.push(item);
				}
			} 		
		}
		return itemsToReturn;
	}
})

.directive('mmuiOrder', [ '$window', '$filter','SessionInfo', 'OrderEntryService',
	function($window, $filter,SessionInfo,OrderEntryService) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				qtyUnits: '='
			},
			templateUrl: 'templates/orderTemplate.page',

			link: function($scope, element, attrs) {

				$scope.config = $window.OpenMRS.drugOrdersConfig;

				var orderContext = {};
				SessionInfo.get().$promise.then(function(info) {
					orderContext.provider = info.currentProvider;
				});


				$scope.discontinueOrder = function() {

					var dcOrder = $scope.order.createDiscontinueOrder(orderContext);
					var draftOrders = [];
					draftOrders.push(dcOrder);

					var encounterContext = {
						patient: $scope.config.patient,
						encounterType: $scope.config.drugOrderEncounterType,
						location: null,
						visit: $scope.config.visit
					};

					$scope.discontinue = {loading : "true"};
					OrderEntryService.signAndSave({ draftOrders: draftOrders }, encounterContext)
					.$promise.then(function(result) {
						location.href = location.href;
					}, function(errorResponse) {
						emr.errorMessage(errorResponse.data.error.message);
						$scope.discontinue.loading = false;
					});

				}
			}
		}
	},
	])

.directive('mmuiDispense', [ '$window', '$filter','SessionInfo', 'OrderEntryService', 'Encounter',
	function($window, $filter, SessionInfo, OrderEntryService, Encounter) {
		return {
			restrict: 'E',
			scope: {
				order: '=',
				config: '='
			},
			templateUrl: 'templates/dispenseTemplate.page',

			link: function(scope, element, attrs) {

				function replaceWithUuids(obj, props) {
					var replaced = angular.extend({}, obj);
					_.each(props, function(prop) {
						if (replaced[prop] && replaced[prop].uuid) {
							replaced[prop] = replaced[prop].uuid;
						}
					});
					return replaced;
				}

				scope.createDispense =  function () {

					var copyProperties = _.pick(scope.order,
						'action','previousOrder','commentToFulfiller', 'drug', 'dosingType', 'numRefills', 'quantity', 'quantityUnits', 'dose',
						'doseUnits', 'frequency', 'asNeeded', 'asNeededCondition', 'route', 'duration', 'durationUnits',
						'dosingInstructions', 'careSetting'
						);
					var override = {
						quantity: scope.order.quantity,
						quantityUnits: scope.order.quantityUnits
					}

					orderToSave = $.extend(copyProperties, override);

					orderToSave = replaceWithUuids(orderToSave, ['drug', 'doseUnits', 'frequency', 'quantityUnits',
						'durationUnits', 'route', 'previousOrder', 'careSetting', 'patient', 'concept', 'orderer',
						'orderReason'
						]);

					var encounter = {
						uuid: scope.order.encounter.uuid,
						order: orderToSave
					};

					var saved = Encounter.save(encounter);
					saved.$promise.then(function(encounter) {
						$rootScope.$broadcast("visit-changed", encounter.visit);
					});
				}
			}
		}
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