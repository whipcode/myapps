package my.webapp.workman.bo;

public class CountryDay extends CalendarDay {
	private boolean pubHoliday;
	private CountryCalendar countryCalendar;

	public void setPubHoliday(boolean pubHoliday) {
		this.pubHoliday = pubHoliday;
	}

	public boolean isPubHoliday() {
		return pubHoliday;
	}

	public void setCountryCalendar(CountryCalendar countryCalendar) {
		this.countryCalendar = countryCalendar;
	}

	public CountryCalendar getCountryCalendar() {
		return countryCalendar;
	}
}
