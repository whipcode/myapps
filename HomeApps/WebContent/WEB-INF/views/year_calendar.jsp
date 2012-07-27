<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>HomeApps - Year Calendar</title>
<jsp:include page="/WEB-INF/css/year-calendar.css" />
<script type="text/javascript">
var monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var weekName = ['S','M','T','W','T','F','S'];
var refDate = new Date();

function getWeekday(date,start) {
	var weekday = date.getDay();

	switch (start) {
	case 'S': return weekday;	/* Sunday */
	case 'M': return (weekday+6) % 7;	/* Monday */
	}

	return weekday;
}

function isHoliday(date) {
	var sDate;

	sDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
	switch (sDate) {
	case '2011-1-1':
	case '2011-2-3':
	case '2011-2-4':
	case '2011-2-5':
	case '2011-4-5':
	case '2011-4-22':
	case '2011-4-23':
	case '2011-5-2':
	case '2011-5-10':
	case '2011-6-6':
	case '2011-7-1':
	case '2011-9-13':
	case '2011-10-1':
	case '2011-10-5':
	case '2011-10-30':
	case '2011-12-26':
	case '2011-12-27':
		return true;
	}
	return false;
}

function renderMonth(monthNode, year, monthNum) {
	var monthLabel;
	var monthGrid;
	var i;
	var tr;
	var td;
	var date;
	var weekday;
	var week;
	var day;
	var showWeekName;

	showWeekName = false;
	weekday = getWeekday(new Date(year,monthNum,1,0,0,0,0),'S');
	date = new Date(year,monthNum,1-weekday,0,0,0,0);

	monthLabel = document.createElement('h2');
	monthLabel.innerHTML = monthName[monthNum];

	monthGrid = document.createElement('table');

	if (showWeekName) {
		tr = document.createElement('tr');
		for (i=0; i<7; i++) {
			td = document.createElement('td');
			td.innerHTML = weekName[i];
			tr.appendChild(td);
		}
		monthGrid.appendChild(tr);
	}

	for (week=0; week<6; week++) {
		tr = document.createElement('tr');
		for (i=0; i<7; i++) {
			td = document.createElement('td');
			if (date.getMonth() == monthNum) {
				td.innerHTML = date.getDate();
				if (i==0 || i==6)
					td.setAttribute('class','holiday');
				if (isHoliday(date))
					td.setAttribute('class','pub-holiday');
			}
			
			tr.appendChild(td);
			date.setDate(date.getDate()+1);
		}
		monthGrid.appendChild(tr);
	}

	monthNode.appendChild(monthLabel);
	monthNode.appendChild(monthGrid);
}

function renderCalendar(year) {
	var yearObj = document.getElementById('year');
	var monthObjs1 = document.getElementById('leftcol').getElementsByTagName('div');
	var monthObjs2 = document.getElementById('rightcol').getElementsByTagName('div');
	var month;

	yearObj.innerHTML = year;
	for (month=0; month<6; month++)
		renderMonth(monthObjs1[month], year, month);
	for (month=6; month<12; month++)
		renderMonth(monthObjs2[month-6], year, month);
}

</script>
</head>
<body onload="renderCalendar(refDate.getFullYear())">

<div class="calendar1" id="calendar">
	<h1 id="year" style="display:none"></h1>
	<div id="leftcol" style="float:left;">
		<div class="month" id="jan""></div>
		<div class="month" id="feb"></div>
		<div class="month" id="mar"></div>
		<div class="month" id="apr"></div>
		<div class="month" id="may"></div>
		<div class="month" id="jun"></div>
	</div>
	<div id="rightcol" style="float:right;">
		<div class="month" id="jul"></div>
		<div class="month" id="aug"></div>
		<div class="month" id="sep"></div>
		<div class="month" id="oct"></div>
		<div class="month" id="nov"></div>
		<div class="month" id="dec"></div>
	</div>
	<div class="clear">&nbsp;</div>
</div>
</body>
</html>