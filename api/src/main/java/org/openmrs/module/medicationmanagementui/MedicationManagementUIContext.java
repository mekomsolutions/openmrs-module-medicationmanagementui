package org.openmrs.module.medicationmanagementui;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.ObsService;
import org.openmrs.api.PersonService;
import org.openmrs.api.VisitService;
import org.openmrs.module.emrapi.adt.AdtService;
import org.openmrs.module.emrapi.utils.ModuleProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

/**
 * Inject this class to access services and global properties.
 */
@Component("medicationManagementUIContext")
public class MedicationManagementUIContext extends ModuleProperties{

	protected final Log log = LogFactory.getLog(getClass());

	@Autowired
    @Qualifier("obsService")
    protected ObsService obsService;

	@Autowired
    @Qualifier("adtService")
    protected AdtService adtService;

	
	public ObsService getObsService() {
		return obsService;
	}
	
	public PersonService getPersonService() {
		return personService;
	}
	
	public VisitService getVisitService() {
		return visitService;
	}
	
	public AdtService getAdtService() {
		return adtService;
	}
	
}
