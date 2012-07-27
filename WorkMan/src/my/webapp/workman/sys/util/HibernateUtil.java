package my.webapp.workman.sys.util;

import java.net.URL;

import org.apache.log4j.Logger;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {
	private static Logger logger = Logger.getLogger(HibernateUtil.class);
	private static SessionFactory sessionFactory;

	public static SessionFactory getSessionFactory(URL configLocation) {
		if (sessionFactory == null) {
			try {
				// Create the SessionFactory from hibernate.cfg.xml
				if (configLocation != null)
					sessionFactory = new Configuration().configure(configLocation).buildSessionFactory();
				else
					sessionFactory = new Configuration().configure().buildSessionFactory();
			}
	
			catch (Throwable ex) {
				// Make sure you log the exception, as it might be swallowed
				logger.error("Initial SessionFactory creation failed. " + ex);
				throw new ExceptionInInitializerError(ex);
			}
		}
		
		return sessionFactory;
	}
}
