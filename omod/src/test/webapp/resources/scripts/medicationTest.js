describe("Medication Management UI", function() {

	beforeEach(function() {
		// creating fake dependencies to instanciate our module
		angular.module('orderService', []);
		angular.module('encounterService', []);

		module('MedicationManagementUI');
	});

	var $controller;

	beforeEach(inject(function(_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe("MMUIPageCtrl unit tests", function() {
		it('expect $scope.value to be 4', function() {
			var $scope = {};
			var controller = $controller('MMUIPageCtrl', {
				$scope: $scope
			});
			expect($scope.value).toBe(4);
		});
	})
});