package my.webapp.workman.bo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class JobTask extends Data {
	public static final int OBJECT_TYPE = 1;
	
	private String desc;
	private Date refDate;
	private boolean due;
	private boolean done;
	private String remarks;
	private long repeatKey;
	private Job job;
	private JobStage stage;
	private List<NoteLink> noteLinks = new ArrayList<NoteLink>();
	
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public boolean isDone() {
		return done;
	}
	public void setDone(boolean done) {
		this.done = done;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public long getRepeatKey() {
		return repeatKey;
	}
	public void setRepeatKey(long repeatKey) {
		this.repeatKey = repeatKey;
	}
	public void setRefDate(Date refDate) {
		this.refDate = refDate;
	}
	public Date getRefDate() {
		return refDate;
	}
	public void setDue(boolean due) {
		this.due = due;
	}
	public boolean isDue() {
		return due;
	}
	public void setJob(Job job) {
		this.job = job;
	}
	public Job getJob() {
		return job;
	}
	public void setStage(JobStage stage) {
		this.stage = stage;
	}
	public JobStage getStage() {
		return stage;
	}
	public void setNoteLinks(List<NoteLink> noteLinks) {
		this.noteLinks = noteLinks;
	}
	public List<NoteLink> getNoteLinks() {
		return noteLinks;
	}
}
