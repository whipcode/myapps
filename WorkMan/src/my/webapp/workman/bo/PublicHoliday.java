package my.webapp.workman.bo;

import java.util.Date;

public class PublicHoliday extends Data {
	private Date date;
	private String shortName;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
}
