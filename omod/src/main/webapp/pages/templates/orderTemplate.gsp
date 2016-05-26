<div>
	<table  style="border-bottom: 3px solid #00463f;">
		<tr title="Click to get more details" style="height:40px">

			
			<td ng-click="showDetails=!showDetails" >
				<span ng-show="order.isActive()" class="status active"></span>
				<span ng-hide="order.isActive()" class="status inactive" style="background-color:#999999"></span>
				<span style="font-weight: bold;">{{ order.drug.display }}: </span>
				<span>{{ order | instructions }}</span>

					<mmui-dispense-tag order="order" orderConfig="config" dispense-config="dispenseConfig"></mmui-dispense-tag>

	
			</td>
			<td ng-click="showDetails=!showDetails">
				<span> {{order | dates }}</span>              
			</td>

			<td style="width:1%;white-space:nowrap; text-align:right;" ng-show="order.isActive()">
				<div>
					<a ng-href="{{order.reviseUrl}}" ng-click="loading=true" title="Revise"  >
						<i class="icon-pencil"></i>
					</a>

					<a ng-click="toDispense=!toDispense" title="Dispense" style="" >
						<i class="icon-external-link"></i>
					</a>

					<a ng-hide="discontinue.loading" title="Discontinue" ng-click="discontinueOrder()">
						<i class="icon-remove"></i>
					</a>
					<span ng-show="discontinue.loading"><img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" width="23px" /></span>
				</div>
			</td>
		</tr>
	</table>

	<div ng-show="showDetails"  style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px;padding-top: 5px ;border: solid 1px #eeeeee; background-color:  #F9F9F9; ">

		<div style="margin-bottom: 15px; margin-top:15px; ">
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

	<span ng-if="config.quantityUnits">
		<mmui-dispense order="order" order-config="config" dispense-config="dispenseConfig" ng-show="toDispense"></mmui-dispense>
	</span>


</div>