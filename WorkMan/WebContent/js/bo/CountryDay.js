function CountryDay() {
	CalendarDay.call();
	this.pubHoliday = false;
}

CountryDay.prototype = new CalendarDay;