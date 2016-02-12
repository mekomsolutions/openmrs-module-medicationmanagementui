package org.openmrs.module.medicationmanagementui.page.controller;

import org.openmrs.Patient;
import org.openmrs.api.OrderService;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.UiUtils;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class MedicationPageController {

	public void controller(@RequestParam("patient") Patient patient,
			@SpringBean("orderService") OrderService orderService,
			UiSessionContext sessionContext,
			UiUtils ui,
			PageModel model) {

		model.put("patient", patient);
	}
}
