<%
ui.decorateWith("appui", "standardEmrPage")

ui.includeJavascript("uicommons", "angular.min.js")
ui.includeJavascript("uicommons", "angular-app.js")
ui.includeJavascript("uicommons", "angular-resource.min.js")
ui.includeJavascript("uicommons", "angular-common.js")
ui.includeJavascript("uicommons", "angular-ui/ui-bootstrap-tpls-0.11.2.js")
ui.includeJavascript("uicommons", "ngDialog/ngDialog.js")
ui.includeJavascript("uicommons", "filters/display.js")
ui.includeJavascript("uicommons", "filters/serverDate.js")
ui.includeJavascript("uicommons", "services/conceptService.js")
ui.includeJavascript("uicommons", "services/drugService.js")
ui.includeJavascript("uicommons", "services/encounterService.js")
ui.includeJavascript("uicommons", "services/orderService.js")
ui.includeJavascript("uicommons", "services/session.js")
ui.includeJavascript("uicommons", "directives/select-concept-from-list.js")
ui.includeJavascript("uicommons", "directives/select-order-frequency.js")
ui.includeJavascript("uicommons", "directives/select-drug.js")
ui.includeJavascript("uicommons", "moment.min.js")

ui.includeJavascript("orderentryui", "order-model.js")
ui.includeJavascript("orderentryui", "order-entry.js")
ui.includeJavascript("orderentryui", "drugOrders.js")

ui.includeJavascript("medicationmanagementui", "medicationManagementUi.js")

%>

<script type="text/javascript">

	var breadcrumbs = [
	{ icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
	{ label: "${ ui.message("medicationmanagementui.page.label")}"}
	];

	window.OpenMRS = window.OpenMRS || {};
	window.OpenMRS.drugOrdersConfig = ${ jsonConfig };

</script>


<div ng-app="MedicationManagementUI">

	<div ng-controller="MMUIPageCtrl">

		<div class="ui-tabs">
			<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header">
				<li ng-repeat="setting in config.careSettings" class="ui-state-default ui-corner-top"
				ng-class="{ 'ui-tabs-active': setting == careSetting, 'ui-state-active': setting == careSetting }">
				<a class="ui-tabs-anchor" ng-click="setCareSetting(setting)">
					{{ setting.display }}
				</a>
			</li>
		</ul>

		<div  ng-controller="MMUIOrderListCtrl" class="ui-tabs-panel ui-widget-content ui-corner-bottom">		

			<h3 style="float:left;">Current Orders</h3>
			<div>
				<span ng-hide="loading" ng-click="loadData()" style="float: right"><i class="icon-refresh"></i></span>
				<span ng-show="loading" style="float: right;"><span>Loading... </span><img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" width="30px" /></span>
			</div>
			<div style="clear: both;"></div>
			<div>
				<% if (context.hasPrivilege("App: orderentryui.drugOrders")) { %>
				<a ng-href="{{config.createOrderUrl}}">
					<button>
						Add
						<i class="icon-plus-sign"></i>
					</button>
				</a>
				<% } %>
			</div>

			<ul>

				<div ng-show="!(allDrugOrders | active | filter:nameText).length" style="margin-top: 3%">
					<div>-- No active order-- </div>
					<div>Click 'Add' to prescribe orders</div>
				</div>
				<li ng-repeat="order in allDrugOrders | visit:config.visit | active | orderBy:'dateActivated':true" style="margin-top: 20px;display: block; width:100%" >

					<div ng-controller="MMUIOrderTemplate">
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

										<a data="{{order.uuid}}" ng-href="{{order.reviseUrl}}" ng-hide="loading" ng-click="loading=true" title="Revise"  >
											<i class="icon-pencil"></i>
										</a>
										
										<a data="{{order.uuid}}"  ng-href="{{order.dispenseUrl}}" ng-hide="loading" title="Dispense" style="" >
											<i class="icon-external-link"></i>
										</a>

										<a ng-hide="loading" data="{{order}}" title="Discontinue" ng-click="discontinueOrder(order)">
											<i class="icon-remove"></i>
										</a>
									</div>
								</td>
							</tr>
						</table>

						<div ng-show="showDetails"  style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px;padding-top: 5px;border: solid 1px #eeeeee; background-color:  #F9F9F9; ">

							<!--
							<div style="margin-top:15px; margin-bottom: 15px">
								<table style="width: 100%">
									<thead>
										<th>
											Dispenses
										</th>
									</thead>
									<tbody>
										<tr ng-repeat="dispense in OrderDispenses">
											<td>
												Dispense1 {{order.orderNumber}}
											</td>  
										</tr>
										<tr>
											<td>
												Dispense2 {{order.orderNumber}}
											</td>  
										</tr>
										<tr>
											<td>
												Dispense3 {{order.orderNumber}}
											</td>  
										</tr>
									</tbody>
								</table>
							</div>
						-->


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
				</div>
			</li>

		</ul>

		<div ng-hide="!(allDrugOrders | active:false | filter:nameText).length" style="margin-top: 30px">
			<a ng-click="showInactive=true" ng-hide="showInactive">Show discontinued and completed <i class="icon-info-sign"></i></a>
		</div>
		<div ng-show="showInactive">
			<h3>Inactive orders</h3>
			<a ng-click="showInactive=false">(Show less)</a>
			<ul>
				<li ng-repeat="order in allDrugOrders | visit:config.visit | active:false | orderBy:'dateActivated':true" style="margin-top: 20px;display: block; width:100%" >

					<div ng-controller="MMUIOrderTemplate">
						<table  style="border-bottom: 3px solid #00463f;">
							<tr title="Click to get more details">
								<td ng-click="showDetails=!showDetails"  style="width: 18%">
									<span ng-show="order.isActive()" class="tag">Active</span>
									<span ng-hide="order.isActive()" class="tag" style="background-color:#999999">Inactive</span>
									<a style="margin-left: 5px;">{{order.orderNumber}} </a>
								</td>
								<td ng-click="showDetails=!showDetails"  style="width: 22%">
									<span> {{order | dates }}</span>              
								</td>
								<td ng-click="showDetails=!showDetails" >
									<div >{{ order | instructions }}</div>
								</td>
								<td style="width:1%;white-space:nowrap; text-align:right;" ng-show="order.isActive()">
									<div>
										<span ng-show="loading"><img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" width="23px" /></span>

										<a data="{{order.uuid}}" ng-href="{{order.reviseUrl}}" ng-hide="loading" ng-click="loading=true" title="Revise"  >
											<i class="icon-pencil"></i>
										</a>
										
										<a data="{{order.uuid}}"  ng-href="{{order.dispenseUrl}}" ng-hide="loading" ng-click="redirectToDispense(order.uuid)" title="Dispense" style="" >
											<i class="icon-external-link"></i>
										</a>

										<a ng-hide="loading" data="{{order}}" title="Discontinue" ng-click="discontinueOrder(order)">
											<i class="icon-remove"></i>
										</a>
									</div>
								</td>
							</tr>
						</table>

						<div ng-show="showDetails"  style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px;padding-top: 5px;border: solid 1px #eeeeee; background-color:  #F9F9F9; ">

							<!--
							<div style="margin-top:15px; margin-bottom: 15px">
								<table style="width: 100%">
									<thead>
										<th>
											Dispenses
										</th>
									</thead>
									<tbody>
										<tr ng-repeat="dispense in OrderDispenses">
											<td>
												Dispense1 {{order.orderNumber}}
											</td>  
										</tr>
										<tr>
											<td>
												Dispense2 {{order.orderNumber}}
											</td>  
										</tr>
										<tr>
											<td>
												Dispense3 {{order.orderNumber}}
											</td>  
										</tr>
									</tbody>
								</table>
							</div>
						-->


						<div style="margin-top:15px; margin-bottom: 15px">
							<div>
								<table style="width: 100%">
									<thead>
										<th>
											Revisions
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
												{{revision.orderNumber}}
											</td>  
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</li>

		</ul>
	</div>

</div>
</div>

</div>
</div>
