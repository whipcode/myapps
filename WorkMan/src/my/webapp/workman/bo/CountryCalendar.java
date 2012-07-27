package my.webapp.workman.bo;

import java.util.Set;

@SuppressWarnings("unchecked")
public class CountryCalendar extends Data {
	private String calendarName;
	private int year;
	private Set countryDays;
	
	public void setCalendarName(String calendarName) {
		this.calendarName = calendarName;
	}
	public String getCalendarName() {
		return calendarName;
	}
	public void setCountryDays(Set countryDays) {
		this.countryDays = countryDays;
	}
	public Set getCountryDays() {
		return countryDays;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public int getYear() {
		return year;
	}
}
