package my.webapp.workman.bo;

import java.util.Date;

public class DateEvent extends Data {
	private Date date;
	private String event;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getEvent() {
		return event;
	}
	public void setEvent(String event) {
		this.event = event;
	}
}
