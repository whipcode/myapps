package my.webapp.workman.bo;

import java.util.Date;

public class JobNotesVersion extends Data {
	private Date modifyDate;
	private String content;
	
	public Date getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
