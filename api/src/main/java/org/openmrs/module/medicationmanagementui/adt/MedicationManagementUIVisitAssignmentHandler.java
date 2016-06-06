/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.medicationmanagementui.adt;


import java.util.Locale;

import org.openmrs.Encounter;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.VisitService;
import org.openmrs.api.context.Context;
import org.openmrs.module.emrapi.adt.AdtService;
import org.openmrs.module.emrapi.adt.EmrApiVisitAssignmentHandler;
import org.openmrs.module.emrapi.visit.VisitDomainWrapper;
import org.openmrs.module.medicationmanagementui.MedicationManagementUIContext;

/**
 * Ensures that encounters are assigned to visits based on the EMR module's business logic.
 * <p/>
 * For now, we require that a compatible visit exist before you're allowed to create an encounter.
 */
public class MedicationManagementUIVisitAssignmentHandler extends EmrApiVisitAssignmentHandler {

	protected AdtService adtService;

	protected MedicationManagementUIContext context = Context.getRegisteredComponent("medicationManagementUIContext", MedicationManagementUIContext.class);
	
	
	/**
	 * Since the OpenMRS core doesn't load this bean via Spring, do some hacky setup here.
	 *
	 * @see https://tickets.openmrs.org/browse/TRUNK-3772
	 */
	public MedicationManagementUIVisitAssignmentHandler() {
		try {
			// in production, set the fields this way
			adtService = context.getAdtService();
		} catch (Exception ex) {
			// unit tests will set the fields manually
		}
	}

	@Override
	public String getDisplayName(Locale locale) {
		return "Medication Management UI Visit Assignment Handler";
	}

	@Override
	public void beforeCreateEncounter(Encounter encounter) {

		super.beforeCreateEncounter(encounter);
				
		Visit activeVisit;

		Patient patient = encounter.getPatient();

		if (encounter.getLocation() == null) {
			throw new IllegalStateException("Cannot create/edit encounter with no location");
		}
		
		// retrieve the active visit
		Location visitLocation = adtService.getLocationThatSupportsVisits(encounter.getLocation());
		VisitDomainWrapper visitWrapper = adtService.getActiveVisit(patient, visitLocation);
		
		// set the active visit to the encounter
		if (visitWrapper != null) {
			activeVisit = visitWrapper.getVisit();
			encounter.setVisit(activeVisit);
		} else {
			throw new IllegalStateException("Cannot create/edit encounter without an Active visit");
		}

	}

}
