package my.webapp.workman.bo;

import java.util.Set;

public class JobNotes extends Data {
	private long jobFileId;
	private String title;
	private JobNotesControl ctl;
	private Set<JobNotesVersion> vers;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public JobNotesControl getControl() {
		return ctl;
	}
	public void setControl(JobNotesControl ctl) {
		this.ctl = ctl;
	}
	public Set<JobNotesVersion> getVers() {
		return vers;
	}
	public void setVers(Set<JobNotesVersion> vers) {
		this.vers = vers;
	}
	public void setJobFileId(long jobFileId) {
		this.jobFileId = jobFileId;
	}
	public long getJobFileId() {
		return jobFileId;
	}
}
