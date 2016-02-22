package org.openmrs.module.medicationmanagementui.page.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.OrderService;
import org.openmrs.api.VisitService;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.medicationmanagementui.MedicationManagementUIConstants;
import org.openmrs.module.webservices.rest.web.ConversionUtil;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.ui.framework.UiUtils;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class MedicationPageController {

	private Visit visit;
	
	public void controller(@RequestParam("patient") Patient patient,
			@RequestParam(value="visit", required=false) String visitUuid,
			@SpringBean("orderService") OrderService orderService,
			@SpringBean("visitService") VisitService visitService,
			UiSessionContext sessionContext,
			UiUtils ui,
			PageModel model) {
		

		Map<String, Object> jsonConfig = new LinkedHashMap<String, Object>();
		
		// if visitUuid is provided in the url, retrieve the visit object and put it in the model
		if (!(visitUuid == null || visitUuid == "" )) {
			visit = visitService.getVisitByUuid(visitUuid);
			jsonConfig.put("visit", convertToFull(visit));
		}
		
		jsonConfig.put("patient", convertToFull(patient));
		jsonConfig.put("orderEncounterType", convertToFull(MedicationManagementUIConstants.ORDER_ENCOUNTER_TYPE_UUID));
		
		model.put("patient", patient);
		model.put("jsonConfig", ui.toJson(jsonConfig));
		
	}
	
    private Object convertToFull(Object object) {
        return object == null ? null : ConversionUtil.convertToRepresentation(object, Representation.FULL);
    }

}
