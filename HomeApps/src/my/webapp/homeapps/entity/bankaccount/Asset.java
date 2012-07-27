package my.webapp.homeapps.entity.bankaccount;

import java.util.HashSet;
import java.util.Set;

import my.webapp.homeapps.sys.DbRecord;

public class Asset extends DbRecord {
	private String name;
	private String category;
	private boolean discontinued;
	private Set<AssetValue> values = new HashSet<AssetValue>();

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public Set<AssetValue> getValues() {
		return values;
	}
	public void setValues(Set<AssetValue> values) {
		this.values = values;
	}
	public void setDiscontinued(boolean discontinued) {
		this.discontinued = discontinued;
	}
	public boolean isDiscontinued() {
		return discontinued;
	}
}
