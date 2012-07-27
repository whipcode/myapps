package my.webapp.workman.biz.dao;

import my.webapp.workman.bo.JobFile;

import org.apache.log4j.Logger;

public class JobFileDao extends AbstractDao {
	private Logger logger = Logger.getLogger(JobFileDao.class);
	
	public JobFile get(long id) {
		JobFile jobFile = new JobFile();
		
		jobFile.setFilename("testing");
		
		logger.trace("get() called");
		return jobFile;
	}

	public long createJobFile(JobFile jobFile) {
		long newJobFileId = 0;
		
		logger.trace("createJobFile() called");
		beginTx();
		
		commit();
		
		return newJobFileId;
	}
}
