<ul>

	<h3>Orders:</h3>
	<li ng-repeat="order in drugOrders">
		<div style="">* Visit: {{order.visit.display}}</div>
		<div style="color:red;">* {{order.orderNumber}}</div>
		<div style="color:green; border-bottom:solid 1px">* {{order.display}}</div>


	</li>
	
	
</ul>