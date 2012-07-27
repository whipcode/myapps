package my.webapp.workman.web.listener;

import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.PropertyConfigurator;

public class Log4jInitListener implements ServletContextListener {
	private static final String configLocationParam = "log4jConfigLocation";

	public void contextInitialized(ServletContextEvent arg0) {
		String configLocation;
		URL configLocationUrl;

		try {
			configLocation = arg0.getServletContext().getInitParameter(configLocationParam);
			configLocationUrl = arg0.getServletContext().getResource(configLocation);
			PropertyConfigurator.configure(configLocationUrl);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
	}

	public void contextDestroyed(ServletContextEvent arg0) {
	}

}
