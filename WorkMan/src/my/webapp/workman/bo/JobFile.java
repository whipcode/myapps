package my.webapp.workman.bo;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class JobFile extends Data {
	private String filename;	/* to be used on the uri */
	private String status;
	private Date startDate;
	private Date endDate;
	private String remarks;
	
	private Set<WeekFocus> weekFocuses = new HashSet<WeekFocus>();
	private Set<WeekTask> weekTasks = new HashSet<WeekTask>();
	private Set<TodayTask> todayTasks = new HashSet<TodayTask>();
	private Set<Job> jobs = new HashSet<Job>();
	private Set<NoteEntry> noteEntries = new HashSet<NoteEntry>();
	
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getStatus() {
		return this.status;
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
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getRemarks() {
		return remarks;
	}
	public Set<WeekFocus> getWeekFocuses() {
		return weekFocuses;
	}
	public void setWeekFocuses(Set<WeekFocus> weekFocuses) {
		this.weekFocuses = weekFocuses;
	}
	public Set<WeekTask> getWeekTasks() {
		return weekTasks;
	}
	public void setWeekTasks(Set<WeekTask> weekTasks) {
		this.weekTasks = weekTasks;
	}
	public Set<TodayTask> getTodayTasks() {
		return todayTasks;
	}
	public void setTodayTasks(Set<TodayTask> todayTasks) {
		this.todayTasks = todayTasks;
	}
	public void setJobs(Set<Job> jobs) {
		this.jobs = jobs;
	}
	public Set<Job> getJobs() {
		return jobs;
	}
	public void setNoteEntries(Set<NoteEntry> noteEntries) {
		this.noteEntries = noteEntries;
	}
	public Set<NoteEntry> getNoteEntries() {
		return noteEntries;
	}
}
