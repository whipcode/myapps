function CountryCalendar() {
	Data.call();
	this.calendarName = '';
	this.year = 0;
	this.countryDays = [];
}

CountryCalendar.prototype = new Data;