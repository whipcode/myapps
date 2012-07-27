package my.webapp.homeapps.entity.bankaccount;

import java.util.Date;

public class Balance {
	private int id;
	private Date month;
	private String type;
	private double amount;
	private String remarks;
	private Account account;
	
	private boolean deleteMark;
	private Date deleteTs;
	private String deleteUr;
	private Date lastUpdateTs;
	private String lastUpdateUr;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Date getMonth() {
		return month;
	}
	public void setMonth(Date month) {
		this.month = month;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public boolean isDeleteMark() {
		return deleteMark;
	}
	public void setDeleteMark(boolean deleteMark) {
		this.deleteMark = deleteMark;
	}
	public Date getDeleteTs() {
		return deleteTs;
	}
	public void setDeleteTs(Date deleteTs) {
		this.deleteTs = deleteTs;
	}
	public String getDeleteUr() {
		return deleteUr;
	}
	public void setDeleteUr(String deleteUr) {
		this.deleteUr = deleteUr;
	}
	public Date getLastUpdateTs() {
		return lastUpdateTs;
	}
	public void setLastUpdateTs(Date lastUpdateTs) {
		this.lastUpdateTs = lastUpdateTs;
	}
	public String getLastUpdateUr() {
		return lastUpdateUr;
	}
	public void setLastUpdateUr(String lastUpdateUr) {
		this.lastUpdateUr = lastUpdateUr;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getType() {
		return type;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public double getAmount() {
		return amount;
	}
	public void setAccount(Account account) {
		this.account = account;
	}
	public Account getAccount() {
		return account;
	}
}
