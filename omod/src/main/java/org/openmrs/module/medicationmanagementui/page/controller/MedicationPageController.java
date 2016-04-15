package org.openmrs.module.medicationmanagementui.page.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.openmrs.CareSetting;
import org.openmrs.EncounterType;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.EncounterService;
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
			@RequestParam(value = "careSetting", required = false) CareSetting careSetting,
			@SpringBean("orderService") OrderService orderService,
			@SpringBean("visitService") VisitService visitService,
			@SpringBean("encounterService") EncounterService encounterService,
			UiSessionContext sessionContext,
			UiUtils ui,
			PageModel model) {


		Map<String, Object> jsonConfig = new LinkedHashMap<String, Object>();

		// if visitUUID is provided in the URL, retrieve the visit object and put it in the model
		if (!(visitUuid == null || visitUuid == "" )) {
			visit = visitService.getVisitByUuid(visitUuid);
			jsonConfig.put("visit", convertToFull(visit));
		}

		if (careSetting != null) {
			jsonConfig.put("intialCareSetting", careSetting.getUuid());
		}


		List<CareSetting> careSettings = orderService.getCareSettings(false);
		jsonConfig.put("careSettings", convertToFull(careSettings));

		jsonConfig.put("patient", convertToFull(patient));

		EncounterType encounterType = encounterService.getEncounterTypeByUuid(MedicationManagementUIConstants.ORDER_ENCOUNTER_TYPE_UUID);
		
		jsonConfig.put("drugOrderEncounterType", convertToFull(encounterType));

		model.put("patient", patient);
		model.put("jsonConfig", ui.toJson(jsonConfig));

	}

	private Object convertToFull(Object object) {
		return object == null ? null : ConversionUtil.convertToRepresentation(object, Representation.FULL);
	}

}
