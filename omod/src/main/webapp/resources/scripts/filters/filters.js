angular.module('MedicationManagementUI.main')

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



.filter('latestDispense', function () {
	return function (observations, order) {
		
		var latestDispense = _.filter(observations, function (obs) {
			return obs.order.uuid == order.uuid
		});

		return latestDispense;
	}

})
