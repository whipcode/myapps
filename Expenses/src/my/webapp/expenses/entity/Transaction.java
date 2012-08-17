package my.webapp.expenses.entity;

import java.util.Date;

public class Transaction extends Base {
	public static final String[] TRANTYPES = {
		"Expenditure",	/* support settleAcc and claimAcc. settleAcc will debit the same amount as the transaction; claimAcc will be debit with the amount but the tranxAcc/settleAcc will be level-set */
		"Income",
		"Investment",	/* amount will be transfered to investmentAcc */
		"Transfer"	/* transferAcc will be credited */
	};
	
	private Date tranDate;
	private int tranType;
	private double amount;
	private String desc;
	private String tranxCatg;
	private String remarks;
	private long repeatKey;

	private Account tranxAcc;
	private Account settleAcc;
	private Date settleDate;
	private Account claimAcc;
	private Date claimDate;
	private Account transferAcc;
//	private Account investmentAcc;
	
	public Date getTranDate() {
		return tranDate;
	}

	public void setTranDate(Date tranDate) {
		this.tranDate = tranDate;
	}

	public int getTranType() {
		return tranType;
	}

	public void setTranType(int tranType) {
		this.tranType = tranType;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
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

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public long getRepeatKey() {
		return repeatKey;
	}

	public void setRepeatKey(long repeatKey) {
		this.repeatKey = repeatKey;
	}

	public Account getTranxAcc() {
		return tranxAcc;
	}

	public void setTranxAcc(Account tranxAcc) {
		this.tranxAcc = tranxAcc;
	}

	public Account getSettleAcc() {
		return settleAcc;
	}

	public void setSettleAcc(Account settleAcc) {
		this.settleAcc = settleAcc;
	}

	public Account getClaimAcc() {
		return claimAcc;
	}

	public void setClaimAcc(Account claimAcc) {
		this.claimAcc = claimAcc;
	}

	public Account getTransferAcc() {
		return transferAcc;
	}

	public void setTransferAcc(Account transferAcc) {
		this.transferAcc = transferAcc;
	}

	public Date getSettleDate() {
		return settleDate;
	}

	public void setSettleDate(Date settleDate) {
		this.settleDate = settleDate;
	}

	public Date getClaimDate() {
		return claimDate;
	}

	public void setClaimDate(Date claimDate) {
		this.claimDate = claimDate;
	}
}
