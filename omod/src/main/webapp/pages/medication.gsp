<%
    ui.decorateWith("appui", "standardEmrPage")

    ui.includeJavascript("uicommons", "angular.min.js")
%>

<script type="text/javascript">
    
    var breadcrumbs = [
        { icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm' },
        { label: "${ ui.message("coreapps.app.activeVisits.label")}"}
    ];
    
</script>


<div ng-app>
  <h1>Proof of concept page</h1>
  <p>Input a text in the box below and confirm that the text entered is displayed in real time next to 'Your text:'</p>
  <input type="text" ng-model="message">
  <p>Your text: {{message}}</p>
  <div style="margin-top:25px;">Patient ID is: ${patient.uuid}</div>
</div>
