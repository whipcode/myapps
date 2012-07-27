<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
import="my.webapp.homeapps.sys.Constants"
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><%= Constants.appName %> - PIM</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/uif/uif-core.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/uif/calendar.css">
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/calendarDao.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/uif/uif-core.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/uif/calendar.js"></script>
<script>
var events;
var calendars;

function readCalendars(year, callbackObj) {
	calendarDao.queryCalendarsByYear(year, callbackObj);
}

function CallbackObj(scope, callback) {
	this.scope = scope;
	this.callback = callback;
}

function App() {
	this.name = "Event Calendar";
}

App.prototype.updateCalendar = function(calendars) {
	uif.widgets['eventCalendar'].setCalendars(calendars);
	alert(this.name);
};

function addMiniCalendar() {
	
}

function init() {
	uif.widgets.createEventCalendar('eventCalendar','test-calendar-wrapper',[]);
	var app = new App();

	readCalendars(new Date().getFullYear(), {callback:function(calendars) {app.updateCalendar(calendars);}});

	addMiniCalendar();
};

</script>
</head>
<body onload="init();">
<div id="notice-bar" class="wrapper">
	<ul>
		<li>events</li>
		<li>emails</li>
		<li>msgs</li>
	</ul>
</div>
<div id="body" class="columns-wrapper">
	<div id="left-panel" class="column">
	<p>Today</p>
	</div>
	<div id="mid-panel" class="column">
		<div id="test-calendar-wrapper" class="wrapper"></div>
		<div id="bulletin" class="widget">
			<p>Bulletin Board</p>
			<p>Bulletin Board</p>
			<p>Bulletin Board</p>
			<p>Bulletin Board</p>
			<p>Bulletin Board</p>
			<p>Bulletin Board</p>
		</div>
	</div>
	<div id="right-panel" class="column">
		<div id="notepad" class="widget">
			<p>note 1</p>
			<p>checklist <strong>(0/2)</strong></p>
			<p>checklist (5/5)</p>
			<p>note 3</p>
		</div>
	</div>
</div>
</body>
<style>


div#notice-bar {background:#fff;border-bottom:1px solid #468}
	div#notice-bar>h2 {position:absolute;top:0;left:0;font-weight:normal}
	div#notice-bar>ul {list-style:none;text-align:center;}
		div#notice-bar>ul>li {display:inline;line-height:1.5em;border:1px outset #888;border-radius:4px;background:#bcd;}

div#body {}
	div#left-panel {width:15%;min-width:100px}

	div#mid-panel {width:65%;min-width:600px}
		div#bulletin {height:5em;border:0px inset #a9a9a9;border-radius:2px;padding:0px;overflow:auto}
		div#bulletin li {background:#888}
		div#event-calendar {background:#bcf;border-radius:4px;padding:4px;}
			div#event-calendar-com-bar {}
			table#calendar {border-collapse: collapse;width:100%}
				table#calendar td {padding:0}
				table#calendar>thead {background: #e3e9ff}
					table#calendar>thead td {width:999px;text-align:left;}
				table#calendar>tbody {background: #fff;}
					table#calendar>tbody td {border:1px solid #ddd}
						table#calendar>tbody td>p {border-bottom:1px solid #eee;background:#F8F9FF;color:#666;font-size:0.6em;text-align:left}
						table#calendar>tbody td>div {height:4em}
							table#calendar>tbody td>div>p {margin:0 0 1px 0;border-radius:4px;background:#eef;font-size:0.8em}

	div#right-panel {width:20%;min-width:200px}
		div#notepad {}
			div#notepad>p {margin:1px;border-radius:2px;padding:2px;background:#eef;font-size:0.8em}
</style>
</html>