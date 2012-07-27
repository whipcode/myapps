package my.webapp.workman.so;

import java.util.Calendar;
import java.util.Date;

import my.webapp.workman.sys.util.WorkCalendar;

import org.apache.commons.lang3.text.StrTokenizer;

public class JobmanPref {
	public static final class STARTING_WEEK {
		public static final int THIS_YEAR = -48;
		public static final int LAST_MONTH = -8;
		public static final int THIS_MONTH = -4;
		public static final int LAST_TWO_WEEK = -2;
		public static final int LAST_WEEK = -1;
		public static final int THIS_WEEK = 0;
	}
	public static final class PLANNER_VIEW {
		public static final int WEEK_PLANNER = 0;
		public static final int DAY_PLANNER = 1;
	}
	
	private int plannerView = PLANNER_VIEW.WEEK_PLANNER;
	private int startingWeekday = 1;	/* 0:sunday */
	private int refWeekDay = 5;	/* 7:sunday */
	private int startingWeek = STARTING_WEEK.LAST_WEEK;
	private int numWeeks = 30;
	private int workingJobfile = 0;
	private String showJobfiles = "1";
	private int autoSaveInterval = 60000;	/* milliseconds */
	
	public int getNumWeeks() {
		return numWeeks;
	}
	public void setNumWeeks(int numWeeks) {
		this.numWeeks = numWeeks;
	}
	public int getRefWeekDay() {
		return refWeekDay;
	}
	public void setRefWeekDay(int refWeekDay) {
		this.refWeekDay = refWeekDay;
	}
	public int getStartingWeekday() {
		return startingWeekday;
	}
	public void setStartingWeekday(int startingWeekday) {
		this.startingWeekday = startingWeekday;
	}
	public int getStartingWeek() {
		return startingWeek;
	}
	public void setStartingWeek(int startingWeek) {
		this.startingWeek = startingWeek;
	}

	public Date getStartDate() {
		WorkCalendar cal = new WorkCalendar();
		cal.setLenient(true);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		
		/* Seek to the target date */ 
		switch (startingWeek) {
		case STARTING_WEEK.THIS_YEAR:
			cal.set(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.MONTH, 0);
			break;
		case STARTING_WEEK.LAST_MONTH:
			cal.set(Calendar.DAY_OF_MONTH, 1);
			cal.add(Calendar.MONTH, -1);
			break;
		case STARTING_WEEK.THIS_MONTH:
			cal.set(Calendar.DAY_OF_MONTH, 1);
			break;
		case STARTING_WEEK.LAST_TWO_WEEK:
			cal.add(Calendar.DAY_OF_MONTH, -14);
			break;
		case STARTING_WEEK.LAST_WEEK:
			cal.add(Calendar.DAY_OF_MONTH, -7);
			break;
		}
		
		/* Seek to the first day of the week */
		cal.setStartOfWeek(startingWeekday);
		if (cal.get(Calendar.DAY_OF_WEEK) <= refWeekDay)
			cal.add(Calendar.DAY_OF_MONTH, -cal.get(Calendar.DAY_OF_WEEK)+startingWeekday);
		else
			cal.add(Calendar.DAY_OF_MONTH, 7-cal.get(Calendar.DAY_OF_WEEK)+startingWeekday);
		return cal.getTime();
	}
	public void setWorkingJobfile(int workingJobfile) {
		this.workingJobfile = workingJobfile;
	}
	public int getWorkingJobfile() {
		return workingJobfile;
	}
	public void setShowJobfiles(String showJobfiles) {
		this.showJobfiles = showJobfiles;
	}
	public String getShowJobfiles() {
		return showJobfiles;
	}
	public String[] getShowJobfilesArray() {
		StrTokenizer tokens = new StrTokenizer(showJobfiles, ',');
		return tokens.getTokenArray();
	}
	public void setAutoSaveInterval(int autoSaveInterval) {
		this.autoSaveInterval = autoSaveInterval;
	}
	public int getAutoSaveInterval() {
		return autoSaveInterval;
	}
	public void setPlannerView(int plannerView) {
		this.plannerView = plannerView;
	}
	public int getPlannerView() {
		return plannerView;
	}
}
