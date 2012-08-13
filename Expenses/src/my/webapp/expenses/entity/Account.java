package my.webapp.expenses.entity;

public class Account extends Base {
	private String name;
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
