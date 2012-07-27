package my.webapp.homeapps.dao;

import org.apache.log4j.Logger;
import org.hibernate.Session;

public abstract class AbstractDao {
	private Logger logger = Logger.getLogger(AbstractDao.class);
	protected Session session = null;
	
	protected Session beginTranx() {
        session = DbUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        return session;
	}
	
	protected void commitTranx() {
		session.getTransaction().commit();
		session = null;
	}
	
	protected void commit() {
		session.getTransaction().commit();
		session = null;
	}
	
	protected void rollbackTranx() {
		logger.warn("transaction rollbacked");
		session.getTransaction().rollback();
		session = null;
	}

	protected void rollback() {
		logger.warn("transaction rollbacked");
		session.getTransaction().rollback();
		session = null;
	}
}
