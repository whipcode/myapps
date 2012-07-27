package my.webapp.workman.web.listener;

import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import my.webapp.workman.sys.util.HibernateUtil;

import org.hibernate.HibernateException;

public class HibernateInitListener implements ServletContextListener {
	private static final String configLocationParam = "hibernateConfigLocation";

	public void contextInitialized(ServletContextEvent arg0) {
		String configLocation;
		URL configLocationUrl;
		
		// Initialize Hibernate
		try {
			configLocation = arg0.getServletContext().getInitParameter(configLocationParam);
			if (configLocation != null)
				configLocationUrl = arg0.getServletContext().getResource(configLocation);
			else
				configLocationUrl = null;
			HibernateUtil.getSessionFactory(configLocationUrl).getCurrentSession();
		} catch (HibernateException e1) {
			e1.printStackTrace();
		} catch (MalformedURLException e1) {
			e1.printStackTrace();
		}
	}

	public void contextDestroyed(ServletContextEvent arg0) {
	}

}
