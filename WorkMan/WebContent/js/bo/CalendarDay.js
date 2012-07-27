function CalendarDay() {
	Data.call();
	this.date = null;
	this.name = '';
	this.abv = '';
	this.checked = false;
}

CalendarDay.prototype = new Data;