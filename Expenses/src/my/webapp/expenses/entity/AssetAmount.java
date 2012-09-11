package my.webapp.expenses.entity;

import java.util.Date;

public class AssetAmount extends Base {
	private Asset asset;
	private Date date;
	private String assetOwner;
	private double units;
	
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getAssetOwner() {
		return assetOwner;
	}
	public void setAssetOwner(String assetOwner) {
		this.assetOwner = assetOwner;
	}
	public double getUnits() {
		return units;
	}
	public void setUnits(double units) {
		this.units = units;
	}
	public Asset getAsset() {
		return asset;
	}
	public void setAsset(Asset asset) {
		this.asset = asset;
	}
}
