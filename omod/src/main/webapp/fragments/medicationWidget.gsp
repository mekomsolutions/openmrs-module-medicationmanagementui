<div class="info-section">
	<div class="info-header">
		<i class="icon-medicine"></i>
		<h3>${ ui.message("medicationmanagementui.widget.title").toUpperCase() }</h3>
		 <% if (context.hasPrivilege("App: medicationmanagementui.medication")) { %>
            <a href="${ ui.pageLink("medicationmanagementui", "medication", [patient: patient.id, returnUrl: ui.thisUrl()]) }">
                <i class="icon-share-alt edit-action right" title="${ ui.message("coreapps.edit") }"></i>
            </a>
        <% } %>
	</div>
	<div class="info-body">
	</div>
</div>
