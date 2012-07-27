package my.webapp.workman.biz.dao;

import my.webapp.workman.sys.util.DbUtil;

import org.hibernate.Session;

public abstract class AbstractDao {
	private Session session;
	
	protected void beginTx() {
		this.session = DbUtil.getSession();
		this.session.beginTransaction();
	}
	
	protected void commit() {
		this.session.getTransaction().commit();
	}
	

}
