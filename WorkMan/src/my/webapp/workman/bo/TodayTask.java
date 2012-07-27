package my.webapp.workman.bo;

import java.util.Date;

public class TodayTask extends Data {
	private Date date;
	private String task;
	private JobFile jobfile;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getTask() {
		return task;
	}
	public void setTask(String task) {
		this.task = task;
	}
	public void setJobfile(JobFile jobfile) {
		this.jobfile = jobfile;
	}
	public JobFile getJobfile() {
		return jobfile;
	}
}
