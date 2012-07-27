package my.webapp.workman.so;


public class SysUserRole {
	
	private Long pk;
	private String loginId;
	private String shortName;
	private String status;
	private Datetime creationDate;
	
	public Long getPk() {
		return pk;
	}
	public void setPk(Long pk) {
		this.pk = pk;
	}
	public String getLoginId() {
		return loginId;
	}
	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Datetime getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Datetime creationDate) {
		this.creationDate = creationDate;
	}

}
