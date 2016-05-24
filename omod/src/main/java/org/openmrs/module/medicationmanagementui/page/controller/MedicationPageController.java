package org.openmrs.module.medicationmanagementui.page.controller;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.openmrs.CareSetting;
import org.openmrs.Concept;
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
import org.openmrs.ui.framework.SimpleObject;
import org.openmrs.ui.framework.UiUtils;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class MedicationPageController {


	public void controller(@RequestParam("patient") Patient patient,
			@RequestParam(value="visit", required=false) Visit visit,
			@RequestParam(value = "careSetting", required = false) CareSetting careSetting,
			@SpringBean("orderService") OrderService orderService,
			@SpringBean("visitService") VisitService visitService,
			@SpringBean("encounterService") EncounterService encounterService,
			UiSessionContext sessionContext,
			UiUtils ui,
			PageModel model) {


		Map<String, Object> jsonConfig = new LinkedHashMap<String, Object>();

		if (visit != null) {
			jsonConfig.put("visit", convertToFull(visit));
		}

		if (careSetting != null) {
			jsonConfig.put("intialCareSetting", careSetting.getUuid());
		}

		List<CareSetting> careSettings = orderService.getCareSettings(false);
		jsonConfig.put("careSettings", convertToFull(careSettings));

		jsonConfig.put("patient", convertToFull(patient));

		EncounterType orderEncounterType = encounterService.getEncounterTypeByUuid(MedicationManagementUIConstants.ORDER_ENCOUNTER_TYPE_UUID);
		jsonConfig.put("drugOrderEncounterType", convertToFull(orderEncounterType));
		
		EncounterType dispenseEncounterType = encounterService.getEncounterTypeByUuid(MedicationManagementUIConstants.DISPENSE_ENCOUNTER_TYPE_UUID);
		jsonConfig.put("dispenseEncounterType", convertToFull(dispenseEncounterType));
		
		String orderEntryUiUrl = ui.pageLink("orderentryui", "drugOrders", SimpleObject.create("patientId", patient.getId(), "patient", patient.getId(),  "returnUrl", ui.thisUrl()));
		jsonConfig.put("orderEntryUiUrl", orderEntryUiUrl);
		
		String medicationDispenseUrl = ui.pageLink("medicationdispense", "dispense", SimpleObject.create("patient", patient.getId(),  "returnUrl", ui.thisUrl()));
		jsonConfig.put("medicationDispenseUrl", medicationDispenseUrl);
		
		List<Concept> dispensingUnits = orderService.getDrugDispensingUnits();
		Set<Concept> quantityUnits = new LinkedHashSet<Concept>();
		quantityUnits.addAll(dispensingUnits);
		jsonConfig.put("quantityUnits", convertToFull(dispensingUnits));
		
		model.put("patient", patient);
		model.put("jsonConfig", ui.toJson(jsonConfig));

	}

	private Object convertToFull(Object object) {
		return object == null ? null : ConversionUtil.convertToRepresentation(object, Representation.FULL);
	}

}
