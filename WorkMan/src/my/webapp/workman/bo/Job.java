package my.webapp.workman.bo;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class Job extends Data {
	private String name;
	private Date startDate;
	private Date endDate;
	private String remarks;
	private Set<JobStage> stages = new HashSet<JobStage>();
	private Set<JobTask> tasks = new HashSet<JobTask>();
	private JobFile jobfile;
	
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
	public Set<JobStage> getStages() {
		return stages;
	}
	public void setStages(Set<JobStage> stages) {
		this.stages = stages;
	}
	public Set<JobTask> getTasks() {
		return tasks;
	}
	public void setTasks(Set<JobTask> tasks) {
		this.tasks = tasks;
	}
	public void setJobfile(JobFile jobfile) {
		this.jobfile = jobfile;
	}
	public JobFile getJobfile() {
		return jobfile;
	}
}
