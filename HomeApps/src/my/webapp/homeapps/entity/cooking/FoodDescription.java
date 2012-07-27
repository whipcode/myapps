package my.webapp.homeapps.entity.cooking;

import my.webapp.homeapps.sys.DbRecord;

public class FoodDescription extends DbRecord {
	private int seq;
	private String name;
	private String description;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDescription() {
		return description;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public int getSeq() {
		return seq;
	}
}
