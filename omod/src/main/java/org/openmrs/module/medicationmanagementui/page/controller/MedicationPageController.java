package org.openmrs.module.medicationmanagementui.page.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.openmrs.CareSetting;
import org.openmrs.Concept;
import org.openmrs.EncounterType;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.ConceptService;
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
			@SpringBean("conceptService") ConceptService conceptService,
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

		String orderEntryUiUrl = ui.pageLink("orderentryui", "drugOrders", SimpleObject.create("patientId", patient.getId(), "patient", patient.getId(),  "returnUrl", ui.thisUrl()));
		jsonConfig.put("orderEntryUiUrl", orderEntryUiUrl);

		List<Concept> dispensingUnits = orderService.getDrugDispensingUnits();
		jsonConfig.put("quantityUnits", convertToFull(dispensingUnits));

		Map<String, Object> dispenseConfig = new LinkedHashMap<String, Object>();

		Concept qtyDispenseConcept = conceptService.getConceptByUuid(MedicationManagementUIConstants.QTY_DISPENSE_CONCEPT_MAPPING);
		Concept qtyUnitsDispenseConcepts = conceptService.getConceptByUuid(MedicationManagementUIConstants.QTY_UNITS_DISPENSE_CONCEPT_MAPPING);
		Concept medicationDispenseConcepts = conceptService.getConceptByUuid(MedicationManagementUIConstants.MEDICATION_DISPENSE_CONCEPT_MAPPING);
		Concept orderDispenseConcepts = conceptService.getConceptByUuid(MedicationManagementUIConstants.ORDER_DISPENSE_CONCEPT_MAPPING);

		dispenseConfig.put("qtyDispenseConcept", qtyDispenseConcept);
		dispenseConfig.put("qtyUnitsDispenseConcept", qtyUnitsDispenseConcepts);
		dispenseConfig.put("medicationDispenseConcept", medicationDispenseConcepts);
		dispenseConfig.put("orderDispenseConcept", orderDispenseConcepts);

		EncounterType dispenseEncounterType = encounterService.getEncounterTypeByUuid(MedicationManagementUIConstants.DISPENSE_ENCOUNTER_TYPE_UUID);
		dispenseConfig.put("dispenseEncounterType", convertToFull(dispenseEncounterType));

		String medicationDispenseUrl = ui.pageLink("medicationdispense", "dispense", SimpleObject.create("patient", patient.getId(),  "returnUrl", ui.thisUrl()));
		dispenseConfig.put("medicationDispenseUrl", medicationDispenseUrl);


		model.put("patient", patient);
		model.put("jsonConfig", ui.toJson(jsonConfig));
		model.put("dispenseConfig", ui.toJson(dispenseConfig));


	}

	private Object convertToFull(Object object) {
		return object == null ? null : ConversionUtil.convertToRepresentation(object, Representation.FULL);
	}

}
