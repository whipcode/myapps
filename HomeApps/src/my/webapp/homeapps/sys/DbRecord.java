package my.webapp.homeapps.sys;

import java.util.Date;

public abstract class DbRecord {
	private int id;
	private boolean deleteMark;
	private Date lastUpdTs;
	private String lastUpdUr;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Date getLastUpdTs() {
		return lastUpdTs;
	}
	public void setLastUpdTs(Date lastUpdTs) {
		this.lastUpdTs = lastUpdTs;
	}
	public String getLastUpdUr() {
		return lastUpdUr;
	}
	public void setLastUpdUr(String lastUpdUr) {
		this.lastUpdUr = lastUpdUr;
	}
	public void setDeleteMark(boolean deleteMark) {
		this.deleteMark = deleteMark;
	}
	public boolean isDeleteMark() {
		return deleteMark;
	}
}
