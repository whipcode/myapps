package my.webapp.expenses.util;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtil {
	public static Date addMonth(Date orgDate, int nMonths) {
		if (orgDate != null) {
			GregorianCalendar cal = new GregorianCalendar();
			cal.setTime(orgDate);
			cal.setLenient(true);
			cal.add(Calendar.MONTH, nMonths);
			
			return cal.getTime();
		}
		return null;
	}
}
