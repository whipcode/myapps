package my.webapp.homeapps.entity.bankaccount;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class Account {
	private int id;
	private String accName;
	private String assetCategory;
	private String assetName;
	private String owner;
	private Set<Balance> monthlyBalances = new HashSet<Balance>();
	private Set<Transaction> transactions = new HashSet<Transaction>();
	private Set<Budget> budgets = new HashSet<Budget>();
	private String mailTo;
	
	private boolean deleteMark;
	private Date deleteTs;
	private String deleteUr;
	private Date lastUpdateTs;
	private String lastUpdateUr;
	
	public void setId(int id) {
		this.id = id;
	}
	public int getId() {
		return id;
	}
	public String getAccName() {
		return accName;
	}
	public void setAccName(String accName) {
		this.accName = accName;
	}
	public Set<Balance> getMonthlyBalances() {
		return monthlyBalances;
	}
	public void setMonthlyBalances(Set<Balance> monthlyBalances) {
		this.monthlyBalances = monthlyBalances;
	}
	public Set<Transaction> getTransactions() {
		return transactions;
	}
	public void setTransactions(Set<Transaction> transactions) {
		this.transactions = transactions;
	}
	public Set<Budget> getBudgets() {
		return budgets;
	}
	public void setBudgets(Set<Budget> budgets) {
		this.budgets = budgets;
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
	public String getAssetCategory() {
		return assetCategory;
	}
	public void setAssetCategory(String assetCategory) {
		this.assetCategory = assetCategory;
	}
	public String getAssetName() {
		return assetName;
	}
	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public void setMailTo(String mailTo) {
		this.mailTo = mailTo;
	}
	public String getMailTo() {
		return mailTo;
	}
	
}
