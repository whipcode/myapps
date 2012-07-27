package my.webapp.homeapps.entity.houseitem;

import java.util.Set;

@SuppressWarnings("unchecked")
public class HouseItem {
	private int id;
	private String name;
	private int order;
	private Set prices;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	public Set getPrices() {
		return prices;
	}
	public void setPrices(Set prices) {
		this.prices = prices;
	}
}
