<%
ui.decorateWith("appui", "standardEmrPage")

ui.includeJavascript("uicommons", "angular.min.js")
ui.includeJavascript("uicommons", "angular-resource.min.js")
ui.includeJavascript("uicommons", "angular-common.js")
ui.includeJavascript("uicommons", "angular-app.js")

ui.includeJavascript("medicationmanagementui", "medicationManagementUI.js")
ui.includeJavascript("uicommons", "services/orderService.js")
ui.includeJavascript("uicommons", "services/encounterService.js")

%>

<script type="text/javascript">

    var breadcrumbs = [
    { icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
    { label: "${ ui.message("coreapps.app.activeVisits.label")}"}
    ];
    
    window.OpenMRS = window.OpenMRS || {};
    window.OpenMRS.drugOrdersConfig = ${ jsonConfig };
    
    var config = OpenMRS.drugOrdersConfig;
    
    
</script>


<div ng-app="MedicationManagementUI">

    <div ng-controller="MMUIPageCtrl">
      <div style="margin-top:25px;"><i>Patient ID is: ${patient.uuid}</i></div>
      <mmui-orders></mmui-orders>
  </div>
</div>
