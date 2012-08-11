package my.webapp.expenses.util;

import org.apache.log4j.Logger;

public class LogUtil {
	public static void debug(Object obj, String method, String msg) {
		Logger logger = Logger.getLogger(obj.getClass());
		logger.debug(method + "(): " + msg);
	}
}
