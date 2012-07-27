package my.webapp.homeapps.entity.bankaccount;

import java.util.Date;
import java.util.Set;

public class Budget {
	private int id;
	private double amount;
	private Date date;
	private String desc;
	private String budgetCatg;
	private String budgetSubcatg;
	private String remarks;
	
	private Account account;
	private Set<Transaction> deemTransactions;
	
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
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getBudgetCatg() {
		return budgetCatg;
	}
	public void setBudgetCatg(String budgetCatg) {
		this.budgetCatg = budgetCatg;
	}
	public String getBudgetSubcatg() {
		return budgetSubcatg;
	}
	public void setBudgetSubcatg(String budgetSubcatg) {
		this.budgetSubcatg = budgetSubcatg;
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
	public void setDeemTransactions(Set<Transaction> deemTransactions) {
		this.deemTransactions = deemTransactions;
	}
	public Set<Transaction> getDeemTransactions() {
		return deemTransactions;
	}
	public void setAccount(Account account) {
		this.account = account;
	}
	public Account getAccount() {
		return account;
	}
}
