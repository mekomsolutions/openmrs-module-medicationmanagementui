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

  var config = ${ jsonConfig };

</script>

<div ng-app="MedicationManagementUI">

  <div ng-controller="MMUIPageCtrl">
    <div style="margin-top:25px;"><i>Patient ID is: ${patient.uuid}</i></div>

 

    <ul ng-controller="MMUIOrderListCtrl" >

   <h3 ng-show="config.visit">Orders (for visit {{config.visit.display}})</h3>
    <h3 ng-hide="config.visit">Orders (for any visit)</h3>

      <li ng-repeat="order in allDrugOrders | filter:config.visit.uuid | orderBy:'dateActivated':true" style="margin-top: 20px;display: block; width:100%" >

        <div ng-controller="MMUIOrderDetails" >

          <table  ng-click="showDetails=!showDetails" style="border-bottom: 3px solid #00463f;">
            <tr>
              <td style="width: 15%">
                <span class="status active"></span>
                <a style="margin-right: 20px;">{{order.orderNumber}} </a>
              </td>
              <td style="width: 25%">
                <span> {{order.dateActivated | date:'dd/MM/yyyy @ h:mma'}}</span>              
              </td>
              <td>
                <div >{{order.display}}</div>
              </td>
            </tr>
          </table>

          <div ng-show="showDetails"  style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px;padding-top: 5px;border: solid 1px #eeeeee; background-color:  #F9F9F9; ">
            
            <div style="margin-top:15px; margin-bottom: 15px">
              <h6> Dispense  
                <a data="{{order.uuid}}" ng-click="redirectToDispense(order.uuid)" style="border-left:solid 1px; padding-right:6px; padding-left: 10px; margin-left:6px" >
                  <i class="icon-external-link"></i>
                  Dispense this order
                </a>
              </h6>

              <table style="width: 100%">
                <tr ng-repeat="dispense in OrderDispenses">
                  <small>// TODO: to be implemented</small>
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
              </table>
            </div>

            <div style="margin-top:15px; margin-bottom: 15px">
             <h6> Administration  
              <a data="{{order.uuid}}" ng-click="redirectToAdministration(order.uuid)" style="border-left:solid 1px; padding-right:6px; padding-left: 10px; margin-left:6px" >
                <i class="icon-external-link"></i>
                Administration this order
              </a>
            </h6>

            <table style="width: 100%">
              <tr ng-repeat="administration in OrderAdministrations">
                <small>// TODO: to be implemented</small>
                <td>
                  Administration1 {{order.orderNumber}}
                </td>  
              </tr>
              <tr>
                <td>
                  Administration2 {{order.orderNumber}}
                </td>  
              </tr>
              <tr>
                <td>
                  Administration3 {{order.orderNumber}}
                </td>  
              </tr>
            </table>
          </div>

          <div style="margin-top:15px; margin-bottom: 15px">
            <h6> Revisions
              <a data="{{order.uuid}}" ng-click="redirectToRevise(order.uuid)" style="border-left:solid 1px; padding-left:6px; padding-left: 10px; margin-left:6px">
                <i class="icon-pencil"></i>
                Revise
              </a>
            </h6>

            <div>
              <table style="width: 100%">
                <tr ng-repeat="revision in OrderRevisions">
                  <small>// TODO: to be implemented</small>
                  <td>
                    Rev1 {{order.orderNumber}}
                  </td>  
                </tr>
                <tr>
                  <td>
                    Rev2 {{order.orderNumber}}
                  </td>  
                </tr>
                <tr>
                  <td>
                    Rev3 {{order.orderNumber}}
                  </td>  
                </tr>
              </table>
            </div>


          </div>

        </div>
      </div>
    </li>
  </ul>

</div>
</div>
