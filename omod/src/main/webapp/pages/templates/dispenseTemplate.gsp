<div style="text-align: right; margin-top: 5px">
	<p>
		Dispense quantity: 

		<input ng-model="quantity" type="number" min="0" placeholder="Quantity" />
		<select-concept-from-list ng-model="quantityUnit" concepts="config.quantityUnits" placeholder="Units" size="8"></select-concept-from-list required>
		<button type="submit" class="confirm" ng-disabled="dispenseForm.\$invalid" ng-click="createDispense()">Save</button>
	</p>

</div>