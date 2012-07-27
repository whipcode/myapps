package my.webapp.homeapps.entity.cooking;

import my.webapp.homeapps.sys.DbRecord;

public class Ingredient extends DbRecord {
	private String name;
	private String type;
	private int seq;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public int getSeq() {
		return seq;
	}
}
