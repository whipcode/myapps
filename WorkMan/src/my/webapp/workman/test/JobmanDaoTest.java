package my.webapp.workman.test;

import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import my.webapp.workman.bo.DateEvent;
import my.webapp.workman.bo.JobFile;
import my.webapp.workman.bo.PublicHoliday;
import my.webapp.workman.dao.JobmanDao;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class JobmanDaoTest {
	private static JobmanDao dao = new JobmanDao();

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
	}

	public void testSavePublicHoliday() {
		PublicHoliday publicHoliday = new PublicHoliday();
		
		publicHoliday.setDate(new Date(2011,1,1));
		publicHoliday.setShortName("新年");
		dao.savePublicHoliday(publicHoliday);
	}

	
	public void testLoadPublicHolidays() {
		dao.loadPublicHolidays();
	}


	public void testLoadJobFile() throws Exception {
		JobFile jobfile = dao.loadJobFileDetails(1);
		
		if (jobfile != null) {
			System.out.println("Job File: " + jobfile.getFilename());
		}
		else {
			jobfile = new JobFile();
			jobfile.setFilename("JUnit Job File");
			dao.saveJobFile(jobfile);
		}
	}

	public void testSaveDateEvent() throws Exception {
		JobFile jobfile = dao.loadJobFileDetails(1);
		DateEvent dateEvent = new DateEvent();
		
		if (jobfile != null) {
			dateEvent.setDate(new Date());
			dateEvent.setEvent("Testing");
			
			dao.saveDateEvent(dateEvent);
		}
	}
	
	public void testSaveJobFile() throws Exception {
		JobFile jobfile = dao.loadJobFileDetails(1);
		
		if (jobfile != null) {
			System.out.println("Job File: " + jobfile.getFilename());
			
			dao.saveJobFile(jobfile);
		}
	}

	@Test
	public void testLoad() throws Exception {
		Map<String, Object> data = dao.load();
		
		List<JobFile> jobfiles = (List<JobFile>) data.get("jobfiles");
		Iterator<JobFile> itJobFiles = jobfiles.iterator();
		while (itJobFiles.hasNext()) {
			JobFile jobfile = itJobFiles.next();
			System.out.println("Job File: " + jobfile.getFilename());
		}
	}
}
