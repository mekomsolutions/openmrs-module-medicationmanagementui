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
		var EncounterService = {};

		beforeEach(function() {

			// Provide will help us create fake implementations for our dependencies
			module(function($provide) {
				// Fake OrderService Implementation
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
											uuid: "456"
										}
									}, {
										name: "order3",
										encounter: {
											uuid: "789"
										}
									}]
								)
							}
						};
					}
				});
				// Fake EncounterService implementation
				$provide.value('EncounterService', {
					getEncounters: function() {
						return {
							then: function(callback) {
								return callback(
									[{
										name: "encounter1",
										uuid: "123"
									}, {
										name: "encounter2",
										uuid: "456"
									}, {
										name: "encounter3",
										uuid: "789"
									}]
								)
							}
						};
					}

				})
				return null;
			});

			// inject dependencies
			inject(function(_$controller_, _$window_, _OrderService_, _EncounterService_) {
				$controller = _$controller_;
				$window = _$window_;
				OrderService = _OrderService_;
				EncounterService = _EncounterService_;

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
						$window: $window,
						OrderService: OrderService,
						EncounterService: EncounterService
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

			// override the EncounterService for this specific test
			inject(function(EncounterService) {
				EncounterService.getEncounters = function() {
					return {
						then: function(callback) {
							return callback(
								[{
									name: "encounter4",
									uuid: "123",
									visit: {
										uuid: "ABC"
									}
								}, {
									name: "encounter5",
									uuid: "456",
									visit: {
										uuid: "DEF"
									}
								}, {
									name: "encounter6",
									uuid: "789",
									visit: {
										uuid: "GHI"
									}
								}]
							)
						}
					}
				}
			});

			createController();

			expect($scope.allDrugOrders[0].visit.uuid).toBe("ABC");
			expect($scope.allDrugOrders[1].visit.uuid).toBe("DEF");
			expect($scope.allDrugOrders[2].visit.uuid).toBe("GHI");

		});

	})
});