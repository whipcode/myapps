package my.webapp.homeapps.entity.bankaccount;

import java.util.Date;
import java.util.Set;

public class Installment {
	private int id;
	private Set<Transaction> transactions;

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
	public void setTransactions(Set<Transaction> transactions) {
		this.transactions = transactions;
	}
	public Set<Transaction> getTransactions() {
		return transactions;
	}
}
