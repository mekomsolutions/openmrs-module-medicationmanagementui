<style>

form input {
	min-width:5%;
	width:80px;
	display:inline;
}

</style>

<div style="text-align: right; margin-top: 5px">
	<form name="dispenseForm">
	{{previousObservations}}
			Dispense quantity:
			<input ng-model="quantity" type="number" min="0" placeholder="Quantity" required/>
			<select-concept-from-list ng-model="quantityUnit" concepts="orderConfig.quantityUnits" placeholder="Units" size="8" required></select-concept-from-list>
			<button type="submit" class="confirm" ng-disabled="dispenseForm.\$invalid" ng-click="createDispense()">Save</button>
	</form>
</div>