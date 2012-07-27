package my.webapp.homeapps.entity.cooking;

import my.webapp.homeapps.sys.DbRecord;

public class FoodPicture extends DbRecord {
	private Food food;
	private int seq;
	private String path;
	private String filename;
	
	public Food getFood() {
		return food;
	}
	public void setFood(Food food) {
		this.food = food;
	}
	public int getSeq() {
		return seq;
	}
	public void setSeq(int seq) {
		this.seq = seq;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
}
