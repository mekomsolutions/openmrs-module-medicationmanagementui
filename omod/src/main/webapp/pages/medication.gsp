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

			<h3 class="title" style="float:left; margin-top:20px">Current Orders</h3>
			<div>
				<span ng-hide="loading" ng-click="loadData()" style="float: right"><i class="icon-refresh"></i></span>
				<span ng-show="loading" style="float: right;"><span>Loading... </span><img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" width="30px" /></span>
			</div>
			<div style="clear: both;"></div>
			<div style="margin-top: 15px;margin-left:2px;font-weight: bold">
				<% if (context.hasPrivilege("App: orderentryui.drugOrders")) { %>
				<a ng-href="{{config.createOrderUrl}}">
						Add
						<i class="icon-plus-sign"></i>
				</a>
				<% } %>
			</div>

			<ul>

				<div ng-show="!(activeDrugOrders  | careSetting:careSetting | filter:nameText).length" style="margin-top: 3%">
					<div style="margin-bottom: 15px; font-style: italic">-- No active order for {{careSetting.display}} -- </div>
					<div stle>Click 'Add <i class="icon-plus-sign"></i>' to prescribe orders or '<i class="icon-refresh"></i>' to refresh</div>
				</div>
				<li ng-repeat="order in activeDrugOrders | careSetting:careSetting | visit:config.visit | active | orderBy:'dateActivated':true" style="margin-top: 20px;display: block; width:100%" >
					<mmui-order order="order"></mmui-order>
				</li>

			</ul>

			<div ng-hide="!(pastDrugOrders | careSetting:careSetting | filter:nameText).length" style="margin-top: 30px">
				<a ng-click="showInactive=true" ng-hide="showInactive">Show discontinued and completed <i class="icon-info-sign"></i></a>
			</div>
			<div ng-show="showInactive">
				<h3 style="margin-top: 40px">Inactive orders</h3>
				<a ng-click="showInactive=false">(Show less)</a>
				<ul>
					<li ng-repeat="order in pastDrugOrders | careSetting:careSetting | visit:config.visit | orderBy:'dateActivated':true" style="margin-top: 20px;display: block; width:100%" >
						<mmui-order order="order"></mmui-order>
					</li>

				</ul>
			</div>

		</div>
	</div>

</div>
</div>
