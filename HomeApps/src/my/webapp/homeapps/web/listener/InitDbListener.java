package my.webapp.homeapps.web.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import my.webapp.homeapps.dao.DbUtil;

import org.apache.log4j.Logger;

public class InitDbListener implements ServletContextListener {
	Logger logger = Logger.getLogger(InitDbListener.class);
//	private static final String configLocationParam = "hibernateConfigLocation";
	
//	private void config(ServletContext context) {
//		String configLocation;
//		URL configLocationUrl;
//		
//		// Initialize Hibernate
//		try {
//			configLocation = context.getInitParameter(configLocationParam);
//			if (configLocation != null)
//				configLocationUrl = context.getResource(configLocation);
//			else
//				configLocationUrl = null;
//			//HibernateUtil.getSessionFactory(configLocationUrl).getCurrentSession();
//		} catch (HibernateException e1) {
//			e1.printStackTrace();
//		} catch (MalformedURLException e1) {
//			e1.printStackTrace();
//		}
//	}

	public void contextInitialized(ServletContextEvent arg0) {
		DbUtil.TestConnection();
	}

	public void contextDestroyed(ServletContextEvent arg0) {
	}

}
