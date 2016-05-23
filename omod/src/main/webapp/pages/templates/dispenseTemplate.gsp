<div style="text-align: right;">
	<p>
		Dispense quantity: 

		<input ng-model="order.quantity" type="number" min="0" placeholder="Quantity" />
		<select-concept-from-list ng-model="order.quantityUnits" concepts="config.quantityUnits" placeholder="Units" size="8"></select-concept-from-list>
		<button type="submit" class="confirm" ng-disabled="dispenseForm.\$invalid" ng-click="createDispense()">Save</button>
	</p>

</div>