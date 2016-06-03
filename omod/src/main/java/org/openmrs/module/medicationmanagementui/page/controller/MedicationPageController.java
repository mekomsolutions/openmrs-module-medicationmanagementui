package org.openmrs.module.medicationmanagementui.page.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.openmrs.CareSetting;
import org.openmrs.Concept;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.ConceptService;
import org.openmrs.api.EncounterService;
import org.openmrs.api.OrderService;
import org.openmrs.api.VisitService;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.emrapi.adt.AdtService;
import org.openmrs.module.emrapi.patient.PatientDomainWrapper;
import org.openmrs.module.emrapi.visit.VisitDomainWrapper;
import org.openmrs.module.medicationmanagementui.MedicationManagementUIConstants;
import org.openmrs.module.webservices.rest.web.ConversionUtil;
import org.openmrs.module.webservices.rest.web.representation.Representation;
import org.openmrs.ui.framework.SimpleObject;
import org.openmrs.ui.framework.UiUtils;
import org.openmrs.ui.framework.annotation.InjectBeans;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class MedicationPageController {


	public void controller(@RequestParam("patient") Patient patient,
			@RequestParam(value = "careSetting", required = false) CareSetting careSetting,
			@SpringBean("orderService") OrderService orderService,
			@SpringBean("visitService") VisitService visitService,
			@SpringBean("encounterService") EncounterService encounterService,
			@SpringBean("conceptService") ConceptService conceptService,
			@SpringBean("adtService") AdtService adtService,

			UiSessionContext sessionContext,
			UiUtils ui,
			PageModel model) {

		Map<String, Object> orderConfig = new LinkedHashMap<String, Object>();

		// retrieve the active visit
		Location visitLocation = adtService.getLocationThatSupportsVisits(sessionContext.getSessionLocation());
		VisitDomainWrapper visitWrapper = adtService.getActiveVisit(patient, visitLocation);
		orderConfig.put("activeVisit", visitWrapper == null ? null : convertToRef(visitWrapper.getVisit()));

		if (careSetting != null) {
			orderConfig.put("intialCareSetting", careSetting.getUuid());
		}

		List<CareSetting> careSettings = orderService.getCareSettings(false);
		orderConfig.put("careSettings", convertToFull(careSettings));

		orderConfig.put("patient", convertToFull(patient));

		EncounterType orderEncounterType = encounterService.getEncounterTypeByUuid(MedicationManagementUIConstants.ORDER_ENCOUNTER_TYPE_UUID);
		orderConfig.put("drugOrderEncounterType", convertToRef(orderEncounterType));

		String orderEntryUiUrl = ui.pageLink("orderentryui", "drugOrders", SimpleObject.create("patientId", patient.getId(), "patient", patient.getId(),  "returnUrl", ui.thisUrl()));
		orderConfig.put("orderEntryUiUrl", orderEntryUiUrl);

		List<Concept> dispensingUnits = orderService.getDrugDispensingUnits();
		orderConfig.put("quantityUnits", convertToFull(dispensingUnits));

		Map<String, Object> dispenseConfig = new LinkedHashMap<String, Object>();

		Concept qtyDispenseConcept  = conceptService.getConceptByMapping(MedicationManagementUIConstants.QTY_DISPENSE_CONCEPT_MAPPING.split(":")[1], 
				MedicationManagementUIConstants.QTY_DISPENSE_CONCEPT_MAPPING.split(":")[0]);
		Concept qtyUnitDispenseConcepts = conceptService.getConceptByMapping(MedicationManagementUIConstants.QTY_UNIT_DISPENSE_CONCEPT_MAPPING.split(":")[1], 
				MedicationManagementUIConstants.QTY_UNIT_DISPENSE_CONCEPT_MAPPING.split(":")[0]);
		Concept medicationDispenseConcepts = conceptService.getConceptByMapping(MedicationManagementUIConstants.MEDICATION_DISPENSE_CONCEPT_MAPPING.split(":")[1],
				MedicationManagementUIConstants.MEDICATION_DISPENSE_CONCEPT_MAPPING.split(":")[0]);
		Concept orderDispenseConcepts = conceptService.getConceptByMapping(MedicationManagementUIConstants.ORDER_DISPENSE_CONCEPT_MAPPING.split(":")[1],
				MedicationManagementUIConstants.ORDER_DISPENSE_CONCEPT_MAPPING.split(":")[0]);

		dispenseConfig.put("qtyDispenseConcept", convertToRef(qtyDispenseConcept));
		dispenseConfig.put("qtyUnitDispenseConcept", convertToRef(qtyUnitDispenseConcepts));
		dispenseConfig.put("medicationDispenseConcept", convertToRef(medicationDispenseConcepts));
		dispenseConfig.put("orderDispenseConcept", convertToRef(orderDispenseConcepts));

		EncounterType dispenseEncounterType = encounterService.getEncounterTypeByUuid(MedicationManagementUIConstants.DISPENSE_ENCOUNTER_TYPE_UUID);
		dispenseConfig.put("dispenseEncounterType", convertToFull(dispenseEncounterType));

		String medicationDispenseUrl = ui.pageLink("medicationdispense", "dispense", SimpleObject.create("patient", patient.getId(),  "returnUrl", ui.thisUrl()));
		dispenseConfig.put("medicationDispenseUrl", medicationDispenseUrl);

		model.put("patient", patient);
		model.put("orderConfig", ui.toJson(orderConfig));
		model.put("dispenseConfig", ui.toJson(dispenseConfig));
		
	}

	private Object convertToFull(Object object) {
		return object == null ? null : ConversionUtil.convertToRepresentation(object, Representation.FULL);
	}

	private Object convertToRef(Object object) {
		return object == null ? null : ConversionUtil.convertToRepresentation(object, Representation.REF);
	}
}
