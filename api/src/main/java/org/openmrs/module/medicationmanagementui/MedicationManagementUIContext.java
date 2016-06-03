package org.openmrs.module.medicationmanagementui;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.ObsService;
import org.openmrs.api.PersonService;
import org.openmrs.module.emrapi.utils.ModuleProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

/**
 * Inject this class to access services and global properties.
 */
@Component("medicationManagementContext")
public class MedicationManagementUIContext extends ModuleProperties{

	protected final Log log = LogFactory.getLog(getClass());

	@Autowired
    @Qualifier("obsService")
    protected ObsService obsService;

	
	public ObsService getObsService() {
		return obsService;
	}
	
	public PersonService getPersonService() {
		return personService;
	}
	
}
