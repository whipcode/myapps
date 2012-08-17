package my.webapp.expenses.entity;

import java.util.Date;

public class AssetAmount extends Base {
	private Asset asset;
	private Date date;
	private String assetOwner;
	private double amount;
	
	public Asset getAsset() {
		return asset;
	}
	public void setAsset(Asset asset) {
		this.asset = asset;
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
	public String getAssetOwner() {
		return assetOwner;
	}
	public void setAssetOwner(String assetOwner) {
		this.assetOwner = assetOwner;
	}
}
