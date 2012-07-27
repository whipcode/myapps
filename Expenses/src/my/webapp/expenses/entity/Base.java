package my.webapp.expenses.entity;

import java.util.Date;

public abstract class Base {
	private int id;
	private String owner;
	private boolean deleted;
	private Date lastUpdateTs;
	private int lastUpdateUr;

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Date getLastUpdateTs() {
		return lastUpdateTs;
	}
	public void setLastUpdateTs(Date lastUpdateTs) {
		this.lastUpdateTs = lastUpdateTs;
	}
	public int getLastUpdateUr() {
		return lastUpdateUr;
	}
	public void setLastUpdateUr(int lastUpdateUr) {
		this.lastUpdateUr = lastUpdateUr;
	}
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	public boolean isDeleted() {
		return deleted;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getOwner() {
		return owner;
	}
}
