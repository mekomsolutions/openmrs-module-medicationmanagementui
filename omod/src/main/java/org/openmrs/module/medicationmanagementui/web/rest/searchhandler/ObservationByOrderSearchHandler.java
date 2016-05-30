package org.openmrs.module.medicationmanagementui.web.rest.searchhandler;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.openmrs.Obs;
import org.openmrs.Order;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.api.RestService;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.api.SearchConfig;
import org.openmrs.module.webservices.rest.web.resource.api.SearchHandler;
import org.openmrs.module.webservices.rest.web.resource.api.SearchQuery;
import org.openmrs.module.webservices.rest.web.resource.impl.EmptySearchResult;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.response.ResponseException;
import org.openmrs.module.webservices.rest.web.v1_0.resource.openmrs1_8.OrderResource1_8;
import org.openmrs.module.webservices.rest.web.v1_0.resource.openmrs1_8.PatientResource1_8;
import org.springframework.stereotype.Component;


@Component
public class ObservationByOrderSearchHandler implements SearchHandler {

    private final SearchConfig searchConfig = new SearchConfig("byOrder", RestConstants.VERSION_1 + "/obs", Arrays.asList("1.8.*", "1.9.*", "1.10.*", "1.11.*", "1.12.*", "2.0.*"),
            Arrays.asList(new SearchQuery.Builder("Allows you to find Observations by patient and order").withRequiredParameters("patient", "order").build()));

    /**
     * @see org.openmrs.module.webservices.rest.web.resource.api.SearchHandler#getSearchConfig()
     */
    @Override
    public SearchConfig getSearchConfig() {
        return this.searchConfig;
    }
    
    /**
     * @see org.openmrs.module.webservices.rest.web.resource.api.SearchHandler#search(org.openmrs.module.webservices.rest.web.RequestContext)
     */
    @Override
    public PageableResult search(RequestContext context) throws ResponseException {

    	String patientUuid = context.getRequest().getParameter("patient");
		String orderUuid = context.getRequest().getParameter("order");
		if (patientUuid != null) {
			Patient patient = ((PatientResource1_8) Context.getService(RestService.class).getResourceBySupportedClass(
					Patient.class)).getByUniqueId(patientUuid);
			if (patient == null)
				return new EmptySearchResult();

			List<Obs> patientObs = Context.getObsService().getObservationsByPerson(patient);

			if (orderUuid != null) {
				Order order = ((OrderResource1_8) Context.getService(RestService.class).getResourceBySupportedClass(
						Order.class)).getByUniqueId(orderUuid);
				if (order == null) {
					return new EmptySearchResult();
				} else {
					List<Obs> orderObs = new ArrayList<Obs>();
					for (Obs obs : patientObs) {
						Order obsOrder = obs.getOrder();
						if (obsOrder != null && order.getUuid().equals(obsOrder.getUuid())) {
							orderObs.add(obs);
						}
					}
					return new NeedsPaging<Obs>(orderObs, context);
				}
			}

			return new NeedsPaging<Obs>(patientObs, context);
		}
        return new EmptySearchResult();
    }
}


