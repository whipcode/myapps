package my.webapp.expenses.entity;

public class Account extends Base {
	public static final String[] ACCTYPES = {
		"Saving Account",
		"Credit Card Account",
		"Investment Account"
	};
	
	private String name;
	private int accType;
	private String assetType;
	private String desc;
	private String accOwner;
	
	private Account defSettleAcc;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAccType() {
		return accType;
	}

	public void setAccType(int accType) {
		this.accType = accType;
	}

	public String getAssetType() {
		return assetType;
	}

	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getAccOwner() {
		return accOwner;
	}

	public void setAccOwner(String accOwner) {
		this.accOwner = accOwner;
	}

	public Account getDefSettleAcc() {
		return defSettleAcc;
	}

	public void setDefSettleAcc(Account defSettleAcc) {
		this.defSettleAcc = defSettleAcc;
	}
}
