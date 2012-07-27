package my.webapp.homeapps.entity.houseitem;

import java.util.Set;

@SuppressWarnings("unchecked")
public class HouseItemCatg {
	private int id;
	private String name;
	private int order;
	private Set items;
	
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
	public Set getItems() {
		return items;
	}
	public void setItems(Set items) {
		this.items = items;
	}
}
