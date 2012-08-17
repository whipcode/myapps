package my.webapp.expenses.entity;

import java.util.Date;

public class AssetRate extends Base {
	private Asset asset;
	private Date date;
	private double rate;
	
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
	public double getRate() {
		return rate;
	}
	public void setRate(double rate) {
		this.rate = rate;
	}
}
