package my.webapp.expenses.entity;

public class Balance extends Base {
	private Account account;
	private int year;
	private int month;
	private double opening;
	private double closing;
	private boolean calctedOpening;
	private boolean calctedClosing;

	public Account getAccount() {
		return account;
	}
	public void setAccount(Account account) {
		this.account = account;
	}
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	public double getOpening() {
		return opening;
	}
	public void setOpening(double opening) {
		this.opening = opening;
	}
	public double getClosing() {
		return closing;
	}
	public void setClosing(double closing) {
		this.closing = closing;
	}
	public boolean isCalctedOpening() {
		return calctedOpening;
	}
	public void setCalctedOpening(boolean calctedOpening) {
		this.calctedOpening = calctedOpening;
	}
	public boolean isCalctedClosing() {
		return calctedClosing;
	}
	public void setCalctedClosing(boolean calctedClosing) {
		this.calctedClosing = calctedClosing;
	}
}
