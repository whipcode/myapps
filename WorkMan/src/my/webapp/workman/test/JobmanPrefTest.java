package my.webapp.workman.test;

import my.webapp.workman.so.JobmanPref;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class JobmanPrefTest {

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
	}

	
	public void test() {
		JobmanPref pref = new JobmanPref();
		
		pref.setStartingWeek(JobmanPref.STARTING_WEEK.THIS_YEAR);
		pref.getStartDate();

		pref.setStartingWeek(JobmanPref.STARTING_WEEK.LAST_MONTH);
		pref.getStartDate();

		pref.setStartingWeek(JobmanPref.STARTING_WEEK.THIS_MONTH);
		pref.getStartDate();

		pref.setStartingWeek(JobmanPref.STARTING_WEEK.LAST_TWO_WEEK);
		pref.getStartDate();

		pref.setStartingWeek(JobmanPref.STARTING_WEEK.LAST_WEEK);
		pref.getStartDate();

		pref.setStartingWeek(JobmanPref.STARTING_WEEK.THIS_WEEK);
		pref.getStartDate();
	}

	@Test
	public void testGetShowJobfilesArray() {
		JobmanPref pref = new JobmanPref();
		
		pref.setShowJobfiles("");
		System.out.println(pref.getShowJobfilesArray().length);
		
		pref.setShowJobfiles("1,2,3");
		System.out.println(pref.getShowJobfilesArray().length);
	}
}
