package my.webapp.expenses.entity;

import java.util.Date;

public class Closing extends Base {
	private Account account;
	private Date date;
	private double amount;
	private boolean overriden;
	
	public Account getAccount() {
		return account;
	}
	public void setAccount(Account account) {
		this.account = account;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public boolean isOverriden() {
		return overriden;
	}
	public void setOverriden(boolean overriden) {
		this.overriden = overriden;
	}
}
