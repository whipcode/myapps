package my.webapp.workman.bo;

public class JobNotesControl extends Data {
	private	long rowNum;
	private long colNum;
	private boolean isShow;

	long jobNotesId;
	public long getJobNotesId() {
		return jobNotesId;
	}
	public void setJobNotesId(long jobNotesId) {
		this.jobNotesId = jobNotesId;
	}
	public long getRowNum() {
		return rowNum;
	}
	public void setRowNum(long rowNum) {
		this.rowNum = rowNum;
	}
	public long getColNum() {
		return colNum;
	}
	public void setColNum(long colNum) {
		this.colNum = colNum;
	}
	public boolean isShow() {
		return isShow;
	}
	public void setShow(boolean isShow) {
		this.isShow = isShow;
	}
}
