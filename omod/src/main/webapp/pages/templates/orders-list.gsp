<ul>
	<h3 ng-show="config.visit">Orders (for visit {{config.visit.display}})</h3>
	<h3 ng-hide="config.visit">Orders (for any visit)</h3>

	<li style="margin-top: 20px;" ng-repeat="order in allDrugOrders | filter:config.visit.uuid | orderBy:'dateActivated':true">
		<div ng-hide="config.visit" style="">* Visit: {{order.visit.display}}</div>
		<div style="color:red;"><span style="margin-right: 20px;">* {{order.orderNumber}} </span><span> {{order.dateActivated | date:'dd/MM/yyyy @ h:mma'}}</span></div>
		<div style="color:green; border-bottom:solid 1px">* {{order.display}}</div>
	</li>
</ul>