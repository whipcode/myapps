package my.webapp.homeapps.entity.bankaccount;

import java.util.Date;

import my.webapp.homeapps.sys.DbRecord;

public class AssetValue extends DbRecord {
	private Asset asset;
	private String owner;
	private Date date;
	private String valueStr;
	private double value;
	
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
	public String getValueStr() {
		return valueStr;
	}
	public void setValueStr(String valueStr) {
		this.valueStr = valueStr;
	}
	public double getValue() {
		return value;
	}
	public void setValue(double value) {
		this.value = value;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getOwner() {
		return owner;
	}
}
