describe("Medication Management UI", function() {

	beforeEach(function() {
		// creating fake dependencies to instanciate our module
		angular.module('orderService', []);
		angular.module('encounterService', []);

		module('MedicationManagementUI');
	});

	describe("MMUIPageCtrl unit tests", function() {


		it('expect $scope.value to be 4', function() {

			var $controller;
			inject(function(_$controller_) {
				// The injector unwraps the underscores (_) from around the parameter names when matching
				$controller = _$controller_;
			});

			var $scope = {};
			var controller = $controller('MMUIPageCtrl', {
				$scope: $scope
			});
			expect($scope.value).toBe(4);
		});
	});


	describe("MMUIOrderListCtrl unit tests", function() {

		it('expect true to be true', function() {

			var $controller;
			var createController;

			var ORDERS = [{},{},{}]

			var OrderService = {};

			var Encounter = {};	


 			// Provide will help us create fake implementations for our dependencies
 			module(function($provide) {
 				// Fake OrderService Implementation returning a promise
 				$provide.value('OrderService', {
 					getOrders: function() {
 						return { 
 							then: function(callback) {return callback(
 								[
 								{
 									name: "order1",
 									encounter: {
 										name:"",
 										uuid:"1234567890"
 									},
 								},
 								{
 									name: "order2",
 									encounter: {
 										name:"",
 										uuid:"1234567890"
 									}
 								}
 								]
 								)}
 						};
 					}
 				});

 				return null;
 			});

 			inject(function(_$controller_, _$filter_, _$window_, _OrderService_, _Encounter_) {
				// The injector unwraps the underscores (_) from around the parameter names when matching
				$controller = _$controller_;
				$filter = _$filter_;
				$window = _$window_;
				OrderService = _OrderService_;
				Encounter = _Encounter_;

				$window.config = {
					patient:{
						uuid:"1234567890"
					},
					visit:""
				}


		        // Set up our scope
		        $scope = {};


		        createController = $controller('MMUIOrderListCtrl', {
		        	$scope: $scope,
		        	$filter: $filter,
		        	$window: $window,
		        	OrderService: OrderService,
		        	Encounter: Encounter
		        });



		    });

		 	// Jasmine spy over the listStores service. 
		    // Since we provided a fake response already we can just call through. 
		    spyOn(OrderService, 'getOrders').and.callThrough();
		    spyOn(Encounter, 'get').and.callThrough();



		    expect($scope.allDrugOrders.length).toBe(1);
		});
	})
});