package my.webapp.expenses.web.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import my.webapp.expenses.util.DbUtil;

import org.apache.log4j.Logger;

public class InitDbListener implements ServletContextListener {
	Logger logger = Logger.getLogger(InitDbListener.class);

	public void contextInitialized(ServletContextEvent arg0) {
		DbUtil.TestConnection();
	}

	public void contextDestroyed(ServletContextEvent arg0) {
	}

}
