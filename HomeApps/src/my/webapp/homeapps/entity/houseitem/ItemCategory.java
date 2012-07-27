package my.webapp.homeapps.entity.houseitem;

import java.util.Date;
import java.util.Set;

@SuppressWarnings("unchecked")
public class ItemCategory {
	private int id;
	private String groupName;
	private String name;
	private int order;
	private Set items;
	private Date lastUpate;
	
	public Date getLastUpate() {
		return lastUpate;
	}
	public void setLastUpate(Date lastUpate) {
		this.lastUpate = lastUpate;
	}
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
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getGroupName() {
		return groupName;
	}
}
