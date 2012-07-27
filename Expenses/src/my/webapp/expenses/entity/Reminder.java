package my.webapp.expenses.entity;

import java.util.Date;

public class Reminder extends Base {
	private String msg;
	private Date remindDate;
	private boolean acknowledged;
	
	private Transaction tranx;

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Date getRemindDate() {
		return remindDate;
	}

	public void setRemindDate(Date remindDate) {
		this.remindDate = remindDate;
	}

	public boolean isAcknowledged() {
		return acknowledged;
	}

	public void setAcknowledged(boolean acknowledged) {
		this.acknowledged = acknowledged;
	}

	public Transaction getTranx() {
		return tranx;
	}

	public void setTranx(Transaction tranx) {
		this.tranx = tranx;
	}
}
