package my.webapp.homeapps.entity.cooking;

import my.webapp.homeapps.sys.DbRecord;

public class FoodType extends DbRecord {
	private String name;
	private int seq;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public int getSeq() {
		return seq;
	}
}
