<ul>
	<h3 ng-show="visit">Orders for visit {{visit.display}}</h3>
	<h3 ng-hide="visit">Orders</h3>
	<li ng-repeat="order in drugOrders | orderBy:'dateActivated':true">
		<div ng-hide="visit" style="">* Visit: {{order.visit.display}}</div>
		<div style="color:red;"><span style="margin-right: 20px;">* {{order.orderNumber}} </span><span> {{order.dateActivated | date:'dd/MM/yyyy @ h:mma'}}</span></div>
		<div style="color:green; border-bottom:solid 1px">* {{order.display}}</div>
	</li>
</ul>