package my.webapp.expenses.entity;

public class Asset extends Base {
	private String name;
	private String type;
	private boolean discontinued;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setDiscontinued(boolean discontinued) {
		this.discontinued = discontinued;
	}
	public boolean isDiscontinued() {
		return discontinued;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
