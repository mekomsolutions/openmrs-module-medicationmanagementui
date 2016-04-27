<div>
	<table  style="border-bottom: 3px solid #00463f;">
		<tr title="Click to get more details">
			<td ng-click="showDetails=!showDetails"  style="width: 70px">
				<span ng-show="order.isActive()" class="tag">Active</span>
				<span ng-hide="order.isActive()" class="tag" style="background-color:#999999">Inactive</span>
				<a style=""></a>
			</td>
			<td ng-click="showDetails=!showDetails" >
				<span style="font-weight: bold;">{{ order.drug.display }}: </span>
				<span>{{ order | instructions }}</span>
			</td>
			<td ng-click="showDetails=!showDetails">
				<span> {{order | dates }}</span>              
			</td>
			<td style="width:1%;white-space:nowrap; text-align:right;" ng-show="order.isActive()">
				<div>
					<span ng-show="loading"><img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" width="23px" /></span>

					<a ng-href="{{order.reviseUrl}}" ng-hide="loading" ng-click="loading=true" title="Revise"  >
						<i class="icon-pencil"></i>
					</a>

					<a ng-click="toDispense=!toDispense" ng-hide="loading" title="Dispense" style="" >
						<i class="icon-external-link"></i>
					</a>

					<a ng-hide="loading" title="Discontinue" ng-click="discontinueOrder()">
						<i class="icon-remove"></i>
					</a>
				</div>
			</td>
		</tr>
	</table>

	<div ng-show="showDetails"  style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px;padding-top: 5px border: solid 1px #eeeeee; background-color:  #F9F9F9; ">

		<div style="margin-top:15px; margin-bottom: 15px">
			<div>
				<table style="width: 100%">
					<thead>
						<th colspan="2">
							Revision History
						</th>
					</thead>
					<tbody>
						<tr ng-show="!(order.revisions | filter:nameText).length">
							<td>
								--
							</td>
						</tr>
						<tr ng-repeat="revision in order.revisions">
							<td>
								{{revision.action }}: {{revision | instructions }}
							</td>  
							<td>
								{{revision | dates }}
							</td>  
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<mmui-dispense ng-show="toDispense"></mmui-dispense>
</div>