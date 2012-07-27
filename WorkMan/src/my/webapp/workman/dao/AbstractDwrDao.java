package my.webapp.workman.dao;

import javax.servlet.http.HttpServletRequest;

import my.webapp.workman.sys.util.DbUtil;

import org.apache.log4j.Logger;
import org.directwebremoting.WebContextFactory;
import org.hibernate.Session;

public class AbstractDwrDao {
	private Logger logger = Logger.getLogger(AbstractDwrDao.class);
	protected Session session = null;
	protected HttpServletRequest req = WebContextFactory.get().getHttpServletRequest();
	protected String sessionUser = req.getUserPrincipal().getName();
	
	protected Session beginTranx() {
        session = DbUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
		session.enableFilter("hideDeleted");
		logger.trace("Principal:" + sessionUser);
		session.enableFilter("owner").setParameter("owner", sessionUser);
        return session;
	}
	
	protected Session beginTranx(boolean hideDeleted) {
        session = DbUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        if (hideDeleted)
        	session.enableFilter("hideDeleted");
        return session;
	}
	
	protected void commit() {
		session.getTransaction().commit();
	}
	
	protected void rollback() {
		logger.warn("transaction rollbacked");
		session.getTransaction().rollback();
	}
	
	protected String getSessionUser() {
		return req.getUserPrincipal().getName();
	}
}
