package org.openmrs.module.medicationmanagementui;


import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openmrs.uitestframework.test.TestBase;


public class HeaderTest extends TestBase {


//	private HeaderPage headerPage;

	@Before
	public void setUp() {
//		headerPage = new HeaderPage(driver);
		
	}

	@After
	public void logout() throws InterruptedException{
//		headerPage.logOut();
	}

	@Test
	public void verifyTrueIsTrue() throws Exception {
		// this test does nothing. Just here to put the UI testing framework in place
		// TODO: delete useless test
		assertTrue(true);
	}

}