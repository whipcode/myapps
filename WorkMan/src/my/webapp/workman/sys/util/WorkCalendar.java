package my.webapp.workman.sys.util;

import java.util.Calendar;
import java.util.GregorianCalendar;

public class WorkCalendar extends GregorianCalendar {
	private static final long serialVersionUID = 1L;
	private int startOfWeek = 0;	/* 0:sunday, 1:monday, ..., 7: sunday */
	
	public int getStartOfWeek() {
		return startOfWeek;
	}
	
	public void setStartOfWeek(int startingWeekday) {
		startOfWeek = startingWeekday;
	}
	
	public int get(int field) {
		int value = super.get(field);
		
		if (field == Calendar.DAY_OF_WEEK) {
			if (value == Calendar.SUNDAY && startOfWeek != 0)
				value = 7;
			else
				value--;
		}
		
		return value;
	}
}
