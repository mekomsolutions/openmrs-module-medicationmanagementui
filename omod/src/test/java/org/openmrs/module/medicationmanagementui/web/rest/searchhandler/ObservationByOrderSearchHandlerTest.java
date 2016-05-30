package org.openmrs.module.medicationmanagementui.web.rest.searchhandler;

import java.util.List;

import org.apache.commons.beanutils.PropertyUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openmrs.api.ObsService;
import org.openmrs.api.context.Context;
import org.openmrs.module.webservices.rest.SimpleObject;
import org.openmrs.module.webservices.rest.web.response.ResourceDoesNotSupportOperationException;
import org.openmrs.module.webservices.rest.web.v1_0.controller.MainResourceControllerTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.bind.annotation.RequestMethod;

public class ObservationByOrderSearchHandlerTest extends MainResourceControllerTest {

	private String DATASET_PATH = "customTestDataset.xml";
	
	private ObsService service;
	private String PATIENT_UUID = "da7f524f-27ce-4bb2-86d6-6d1d05312bd5";
	
	@Before
	public void init() throws Exception {
		service = Context.getObsService();
		executeDataSet(DATASET_PATH);
	}

	@Override
	public String getURI() {
		return "obs";
	}

	@Test
	public void getSearchConfig_shouldReturnObsByOrder() throws Exception {
		MockHttpServletRequest req = request(RequestMethod.GET, getURI());

		req.addParameter("patient", PATIENT_UUID);
		req.addParameter("order", "921de0a3-05c4-444a-be03-e01b4c4b9142");

		SimpleObject result = deserialize(handle(req));
		List<Object> hits = (List<Object>) result.get("results");

		Assert.assertEquals(3, hits.size());
	}


	@Test
	public void getSearchConfig_shouldReturnEmptyWhenOrderIsNotFound() throws Exception {
		MockHttpServletRequest req = request(RequestMethod.GET, getURI());

		req.addParameter("patient", PATIENT_UUID);
		req.addParameter("order", "12345-abcde");

		SimpleObject result = deserialize(handle(req));
		List<Object> hits = (List<Object>) result.get("results");

		Assert.assertEquals(0, hits.size());
	}
	
	@Test
	public void getSearchConfig_shouldReturnObsByPatientWhenNoOrderIsProvided() throws Exception {
		MockHttpServletRequest req = request(RequestMethod.GET, getURI());

		req.addParameter("patient", PATIENT_UUID);

		SimpleObject result = deserialize(handle(req));
		List<Object> hits = (List<Object>) result.get("results");

		Assert.assertEquals(7, hits.size());
	}

	/**
	 * @see org.openmrs.module.webservices.rest.web.v1_0.controller.MainResourceControllerTest#shouldGetAll()
	 */
	@Override
	@Test(expected = ResourceDoesNotSupportOperationException.class)
	public void shouldGetAll() throws Exception {
		super.shouldGetAll();
	}

	@Override
	public String getUuid() {
		return "39fb7f47-e80a-4056-9285-bd798be13c63";
	}

	@Override
	public long getAllCount() {
		// This method is never called since
		// the 'shouldGetAll' test is overridden and returns exception
		return 0;
	}


}
