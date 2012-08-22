package my.webapp.expenses.entity;

public class RepeatDtl {
	private int times;
	private int months;
	private boolean auto;
	
	public int getTimes() {
		return times;
	}
	public void setTimes(int times) {
		this.times = times;
	}
	public int getMonths() {
		if (months > 0)
			return months;
		else
			return 1;
	}
	public void setMonths(int months) {
		this.months = months;
	}
	public boolean isAuto() {
		return auto;
	}
	public void setAuto(boolean auto) {
		this.auto = auto;
	}
}
