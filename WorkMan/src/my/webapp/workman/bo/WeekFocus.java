package my.webapp.workman.bo;

import java.util.Date;

public class WeekFocus extends Data {
	private Date date;
	private String focus;
	private JobFile jobfile;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getFocus() {
		return focus;
	}
	public void setFocus(String focus) {
		this.focus = focus;
	}
	public void setJobfile(JobFile jobfile) {
		this.jobfile = jobfile;
	}
	public JobFile getJobfile() {
		return jobfile;
	}
}
