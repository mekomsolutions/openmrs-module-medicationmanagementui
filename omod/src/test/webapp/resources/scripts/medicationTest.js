	describe("Medication Management UI", function() {

	beforeEach(function() {
		// creating fake dependencies to instanciate our module
		angular.module('orderService', []);
		angular.module('encounterService', []);
		angular.module('obsService', []);
		angular.module('drugOrders', []);
		angular.module('session', []);
		angular.module('MedicationManagementUI.order', []);
		angular.module('MedicationManagementUI.dispense', []);

		module('MedicationManagementUI.main');
	});

	describe("MMUIOrderListCtrl unit tests", function() {

		var $controller;
		var createController;
		var OrderService = {};
		var results = [];

		beforeEach(function() {

			var results =
			[{
				name: "order1",
				uuid: "AAA",
				encounter: {
					uuid: "123",
					visit: {
						uuid: "ABC"
					}
				},
				previousOrder: {
					uuid: "CCC"
				}
			}, {
				name: "order2",
				uuid: "BBB",
				encounter: {
					uuid: "456",
					visit: {
						uuid: "DEF"
					}
				},
				previousOrder: null
			}, {
				name: "order3",
				uuid: "CCC",
				encounter: {
					uuid: "789",
					visit: {
						uuid: "GHI"
					}
				},
				previousOrder: {
					uuid: "DDD"
				}
			}, {
				name: "order4",
				uuid: "DDD",
				encounter: {
					uuid: "987",
					visit: null
				},
				previousOrder: null
			}];

			// Provide will help us create fake implementations for our dependencies
			module(function($provide) {
				// Fake OrderService Implementation
				$provide.value('OrderService', {
					getOrders: function() {
						return {
							then: function(callback) {
								return callback(results)
							}
						};
					}
				});

				// Fake DrugOrderModelService impl.
				// Simply return the reslults, without being really wrapped
				$provide.value('DrugOrderModelService', {
					wrapOrders: function() {
						return results;
					}
				});

				return null;
			});

			// inject dependencies
			inject(function(_$controller_, _$rootScope_, _$window_, _$q_, _OrderService_, _DrugOrderModelService_) {
				$controller = _$controller_;
				$scope = _$rootScope_;
				$window = _$window_;
				$q = _$q_;
				OrderService = _OrderService_;
				DrugOrderModelService = _DrugOrderModelService_;

				$scope.careSettings = [
				{
					'uuid':'1234678-85432'
				},
				{
					'uuid':'0987698-66543'
				}
				];

				$scope.config = {
					patient: {
						uuid: "123"
					},
					visit: ""
				}

				spyOn($scope, '$on').and.callThrough();

				
				createController = function() {
					$controller('MMUIOrderListCtrl', {
						$scope: $scope,
						$window: $window,
						$q: $q,
						OrderService: OrderService,
						DrugOrderModelService: DrugOrderModelService
					})
					
					// we resolve all promises
					$scope.$apply();
				};
			});
		});


		it('should return all drug orders', function() {

			createController();

			expect($scope.activeDrugOrders.length).toBe(4);
			expect($scope.pastDrugOrders.length).toBe(4);
			expect($scope.allDrugOrders.length).toBe(8);
		});


		it("should retrieve encounter's visit uuid (when provided)", function() {

			createController();

			expect($scope.allDrugOrders[0].encounter.visit.uuid).toBe("ABC");
			expect($scope.allDrugOrders[1].encounter.visit.uuid).toBe("DEF");
			expect($scope.allDrugOrders[2].encounter.visit.uuid).toBe("GHI");

		});

		it("should retrieve revisions", function() {

			createController();

			expect($scope.allDrugOrders[0].revisions[0].uuid).toBe("CCC");
			expect($scope.allDrugOrders[0].revisions[1].uuid).toBe("DDD");

		});

		it("should handle the 'reloadOrders' event", function () {
			
			createController();
			$scope.$broadcast("reloadOrders");

			expect($scope.$on).toHaveBeenCalled();
		})

	});

});