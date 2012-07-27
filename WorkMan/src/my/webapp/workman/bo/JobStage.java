package my.webapp.workman.bo;

import java.util.Date;

public class JobStage extends Data {
	private String name;
	private Date startDate;
	private Date endDate;
	private String remarks;
	private Job job;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public void setJob(Job job) {
		this.job = job;
	}
	public Job getJob() {
		return job;
	}
}
