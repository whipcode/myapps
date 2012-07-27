package my.webapp.homeapps.entity.bankaccount;

import java.util.Date;

public class Transaction {
	private int id;
	private double amount;
	private Date bankDate;
	private String desc;
	private String tranxCatg;
	private String tranxSubcatg;
	private String remarks;
	private Shopping shopping;
	private Transfer transfer;
	private Installment installment;
	private Budget budget;
	private Account account;
	private long repeatKey;
	private String creditCard;
	private boolean remind;
	private String reminderMsg;
	private Date remindDate;
	
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
	public Date getBankDate() {
		return bankDate;
	}
	public void setBankDate(Date bankDate) {
		this.bankDate = bankDate;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getTranxCatg() {
		return tranxCatg;
	}
	public void setTranxCatg(String tranxCatg) {
		this.tranxCatg = tranxCatg;
	}
	public String getTranxSubcatg() {
		return tranxSubcatg;
	}
	public void setTranxSubcatg(String tranxSubcatg) {
		this.tranxSubcatg = tranxSubcatg;
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
	public void setAccount(Account account) {
		this.account = account;
	}
	public Account getAccount() {
		return account;
	}
	public void setShopping(Shopping shopping) {
		this.shopping = shopping;
	}
	public Shopping getShopping() {
		return shopping;
	}
	public void setTransfer(Transfer transfer) {
		this.transfer = transfer;
	}
	public Transfer getTransfer() {
		return transfer;
	}
	public void setInstallment(Installment installment) {
		this.installment = installment;
	}
	public Installment getInstallment() {
		return installment;
	}
	public void setBudget(Budget budget) {
		this.budget = budget;
	}
	public Budget getBudget() {
		return budget;
	}
	public void setRepeatKey(long repeatKey) {
		this.repeatKey = repeatKey;
	}
	public long getRepeatKey() {
		return repeatKey;
	}
	public void setCreditCard(String creditCard) {
		this.creditCard = creditCard;
	}
	public String getCreditCard() {
		return creditCard;
	}
	public void setRemind(boolean remind) {
		this.remind = remind;
	}
	public boolean isRemind() {
		return remind;
	}
	public void setReminderMsg(String reminderMsg) {
		this.reminderMsg = reminderMsg;
	}
	public String getReminderMsg() {
		return reminderMsg;
	}
	public void setRemindDate(Date remindDate) {
		this.remindDate = remindDate;
	}
	public Date getRemindDate() {
		return remindDate;
	}
}
