uif.weekNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
uif.monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

uif.widgets.createEventCalendar = function(id, wrapperId, options) {
	var eventCalendar = uif.createElement('div',id,'event-calendar widget');
	var today = new Date();
	var numRows = options.numRows?options.numRows:6;
	var numDays = options.numDays?options.numDays:7;
	
	eventCalendar
		.createAppendElement('div','commBar','comm-bar inline-blocks-wrapper')
		.createAppendElement('div','calendarRoll','calendar-roll wrapper');

	eventCalendar.commBar
		.createAppendElement('div','prevMonth','prev-month wrapper')
		.createAppendElement('div','monthName','month-name wrapper')
		.createAppendElement('div','nextMonth','next-month wrapper');

	eventCalendar.calendarRoll
		.createAppendElement('div','scrollBackward','scroll-backward wrapper')
		.createAppendElement('div','calendar','calendar wrapper')
		.createAppendElement('div','scrollForward','scroll-forward wrapper');

	eventCalendar.commBar.prevMonth.createElement('a').setHref('').setText('<<');
	eventCalendar.commBar.monthName.createElement('p').setText('January 2011');
	eventCalendar.commBar.nextMonth.createElement('a').setHref('').setText('>>');

	eventCalendar.calendarRoll.scrollBackward.createElement('input').setAttr('type','button').setAttr('value','^');
	
	eventCalendar.calendarRoll.calendar.createElement('table')
		.createAppendElement('thead')
		.createAppendElement('tbody');

	var thead = eventCalendar.calendarRoll.calendar.table.thead;
	var tr = thead.createElement('tr');
	for (var i=0; i<numDays; i++) {
		tr.createElement('td')
			.setText(uif.weekNames[i]);
	}

	var tbody = eventCalendar.calendarRoll.calendar.table.tbody;
	for (var w=0;w<numRows;w++) {
		var tr = tbody.createElement('tr');
		for (var d=0; d<numDays; d++) {
			var td = tr.createElement('td');
			td.createElement('p');
			td.createElement('div');
		}
	}
	
	eventCalendar.calendarRoll.scrollForward.createElement('input').setAttr('type','button').setAttr('value','v');

	eventCalendar.setStartDate = function(startDate) {
		startDate.setDate(startDate.getDate()-startDate.getDay());
		this.days = [];

		for (var date = new Date(startDate), w=0, tr = tbody.getElementsByTagName('tr'); w<numRows; w++) {
			for (var d=0, td = tr[w].getElementsByTagName('td'); d<numDays; d++) {
				this.days[uif.toSysDateStr(date)] = td[d];
				td[d].date = date;
				td[d].setAttr('id','d'+uif.toSysDateStr(date));
				td[d].setAttr('class',(date.getMonth() % 2 == 0)?'odd-month':'even-month');
				
				if (date.toDateString() == today.toDateString())
					td[d].setAttr('class',td[d].getAttr('class')+' today');
	
				td[d].p.setText((date>startDate && date.getDate()>1?'':uif.monthNames[date.getMonth()]+' ')+date.getDate());
				
				date.setDate(date.getDate()+1);
			}
		}

		this.startDate = startDate;
	};

	eventCalendar.setCalendars = function(calendars) {
		for (var i=0; i<calendars.length; i++) {
			for (var d=0; d<calendars[i].days.length; d++) {
				var td = this.days[uif.toSysDateStr(calendars[i].days[d].date)]; 
				if (td) td.p.style.background="#f88";
			}
		}
	};

	var startDate = new Date();
	startDate.setDate(1);

	eventCalendar.setStartDate(startDate);
	eventCalendar.attachToElement(uif.getElementById(wrapperId));
	this[id]=eventCalendar;
	
	return eventCalendar;
};
	
uif.widgets.addEventCalendar = function(id, wrapperId, options) {
	var eventCalendar = uif.createElement('div',id,'event-calendar widget');
	var today = new Date();
	var monthFirstDate = new Date(today.getFullYear(),today.getMonth(),1);
	var monthFirstWeekDay = thisMonthFirstDate.getDay();
	var startDate = new Date(today.getFullYear(),today.getMonth(),1-thisMonthFirstWeekDay);
	
	eventCalendar
		.createAppendElement('div','commBar','comm-bar inline-blocks-wrapper')
		.createAppendElement('div','calendarRoll','calendar-roll wrapper');

	eventCalendar.commBar
		.createAppendElement('div','prevMonth','prev-month wrapper')
		.createAppendElement('div','monthName','month-name wrapper')
		.createAppendElement('div','nextMonth','next-month wrapper');

	eventCalendar.calendarRoll
		.createAppendElement('div','scrollBackward','scroll-backward wrapper')
		.createAppendElement('div','calendar','calendar wrapper')
		.createAppendElement('div','scrollForward','scroll-forward wrapper');

	eventCalendar.commBar.prevMonth.createElement('a').setHref('').setText('<<');
	eventCalendar.commBar.monthName.createElement('p').setText('January 2011');
	eventCalendar.commBar.nextMonth.createElement('a').setHref('').setText('>>');

	eventCalendar.calendarRoll.scrollBackward.createElement('input').setAttr('type','button').setAttr('value','^');
	
	eventCalendar.calendarRoll.calendar.createElement('table')
		.createAppendElement('thead')
		.createAppendElement('tbody');
	
	var thead = eventCalendar.calendarRoll.calendar.table.thead;
	var tr = thead.createElement('tr');
	for (var i=0; i<7; i++) {
		tr.createElement('td')
			.setText(uif.weekNames[i]);
	}

	var tbody = eventCalendar.calendarRoll.calendar.table.tbody;
	var date = new Date(startDate);
	for (var w=0;w<6;w++) {
		var tr = tbody.createElement('tr');
		for (var d=0; d<7; d++) {
			var td = tr.createElement('td','d'+uif.toSysDateStr(date));
			td.setAttr('class',(date.getMonth() % 2 == 0)?'odd-month':'even-month');
			
			if (date.toDateString() == today.toDateString())
				td.setAttr('class',td.getAttr('class')+' today');

			td.createElement('p')
				.setText((date>startDate && date.getDate()>1?'':uif.monthNames[date.getMonth()]+' ')+date.getDate());
			td.createElement('div');
			
			date.setDate(date.getDate()+1);
		}
	}

	eventCalendar.calendarRoll.scrollForward.createElement('input').setAttr('type','button').setAttr('value','v');

	eventCalendar.updateEvents = function(events) {
		for (var i=0; i<events.length; i++) {
			var d = uif.getElementById('d'+uif.toSysDateStr(events[i].date)); 
			if (d != null) {
				d.p.style.background="#f88";
			}
		}
	};

	
	
	eventCalendar.attachToElement(uif.getElementById(wrapperId));

	this.widgets[id] = eventCalendar;
	
	return eventCalendar;
};
