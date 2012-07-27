package my.webapp.homeapps.entity.calendar;

import java.util.Set;

@SuppressWarnings("unchecked")
public class Calendar {
	private int id;
	private int creatorId;
	private String engName;
	private String chnName;
	private Set days;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getCreatorId() {
		return creatorId;
	}
	public void setCreatorId(int creatorId) {
		this.creatorId = creatorId;
	}
	public String getEngName() {
		return engName;
	}
	public void setEngName(String engName) {
		this.engName = engName;
	}
	public String getChnName() {
		return chnName;
	}
	public void setChnName(String chnName) {
		this.chnName = chnName;
	}
	public Set getDays() {
		return days;
	}
	public void setDays(Set days) {
		this.days = days;
	}
}
