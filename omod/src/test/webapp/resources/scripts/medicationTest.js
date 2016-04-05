describe("Medication Management UI", function() {

	beforeEach(function() {
		// creating fake dependencies to instanciate our module
		angular.module('orderService', []);
		angular.module('encounterService', []);

		module('MedicationManagementUI');
	});

	describe("MMUIOrderListCtrl unit tests", function() {

		var $controller;
		var createController;
		var OrderService = {};
		var Encounter = {};

		beforeEach(function() {

			// Provide will help us create fake implementations for our dependencies
			module(function($provide) {
				// Fake OrderService Implementation returning a promise
				$provide.value('OrderService', {
					getOrders: function() {
						return {
							then: function(callback) {
								return callback(
									[{
										name: "order1",
										encounter: {
											uuid: "123"
										},
									}, {
										name: "order2",
										encounter: {
											uuid: "123"
										}
									}, {
										name: "order3",
										encounter: {
											uuid: "123"
										}
									}]
								)
							}
						};
					}
				});
				// Fake Encounter implementation returning a resource
				$provide.value('Encounter', {
					get: function() {
						return {
							$promise: {
								then: function(callback) {
									return callback({
										name: "encounter1",
										uuid: "123"
									})
								}
							}
						}
					}

				})
				return null;
			});

			// inject mock
			inject(function(_$controller_, _$filter_, _$window_, _OrderService_, _Encounter_) {
				$controller = _$controller_;
				$filter = _$filter_;
				$window = _$window_;
				OrderService = _OrderService_;
				Encounter = _Encounter_;

				$window.config = {
					patient: {
						uuid: "123"
					},
					visit: ""
				}

				// Set up our scope
				$scope = {};

				createController = function() {
					$controller('MMUIOrderListCtrl', {
						$scope: $scope,
						$filter: $filter,
						$window: $window,
						OrderService: OrderService,
						Encounter: Encounter
					})
				};
			});
		});


		it('expect all drug orders to be returned', function() {

			createController();

			expect($scope.allDrugOrders.length).toBe(3);
		});

		it('expect all drug orders to have a visit property (even empty)', function() {

			createController();

			$scope.allDrugOrders.forEach(function(currentOrder, index) {
				expect(currentOrder.visit.uuid).not.toBeUndefined();
			})
		});

		it("expect all drug orders to have the encounter's visit uuid (when provided)", function() {

			// override the Encounter service for this specific test
			inject(function(Encounter) {
				Encounter.get = function() {
					return {
						$promise: {
							then: function(callback) {
								return callback({
									name: "encounter1",
									uuid: "123",
									visit: {
										uuid: "123"
									}
								})
							}
						}
					}
				}
			});

			createController();

			$scope.allDrugOrders.forEach(function(currentOrder, index) {
				expect(currentOrder.visit.uuid).toBe("123");
			})
		});

	})
});