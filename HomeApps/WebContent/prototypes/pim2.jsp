<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>PIM Prototype</title>
</head>
<body>
<div id="notice-bar" class="wrapper"><span>notice bar</span>
	<ul>
		<li>event_calender</li>
		<li>email</li>
		<li>msg</li>
	</ul>
</div>
<div id="body" class="column-table">
	<div id="left-panel" class="column">
		<div class="margin-wrapper">
			&nbsp;
		</div>
	</div>
	<div id="mid-panel" class="column">
		<div class="margin-wrapper">
			<div id="bulletin">Bulletin Board</div>
		</div>
		<div class="margin-wrapper">
			<div id="event-calendar">
				<div id="event-calendar-com-bar">Command Bar</div>
				<table id="calendar">
					<thead>
						<tr>
							<c:forEach items="Sun,Mon,Tue,Wed,Thu,Fri,Sat" var="weekday">
								<td>${weekday}</td>
							</c:forEach>
						</tr>
					</thead>
					<tbody>
						<c:forEach begin="0" end="4" var="week">
							<tr>
								<c:forEach begin="${week*7+1}" end="${week*7+7}" var="day">
									<td>
									<p>${day}</p>
									<div>
									<p>Note</p>
									</div>
									</td>
								</c:forEach>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div id="right-panel" class="column">
		<div class="margin-wrapper">
			<div id="notepad-panel">
				<p>notepad</p>
			</div>
		</div>
	</div>
</div>
</body>
<style>
* {margin:0}

div.wrapper {margin:0}

div.margin-wrapper {margin:2px}

div.inline-blocks-wrapper {margin:0;vertical-align:top;}
	div.inline-blocks-wrapper>.inline-block {display:inline-block;margin:0;}

div.column-table {display:table;margin:0;width:100%}
	div.column-table>.column {display:table-cell;margin:0}

div#notice-bar {height:25px;background:#fff;border-bottom:1px solid #468;}
	ul {list-style:none;display:inline-block;}
		li {display:inline;border:1px outset #888;border-radius:4px;background:#bcd;}

div#left-panel {width:20%}

div#body {}
	div#mid-panel {width:60%;min-width:600px}
		div#mid-panel>div {margin:2px}
		div#bulletin {height:5em;border:2px inset #a9a9a9;border-radius:2px;padding:2px}
		div#event-calendar {background: #bcf;padding: 2px;border-radius: 2px;}
			div#event-calendar-com-bar {}
			table#calendar {border-collapse: collapse;width:100%;}
				table#calendar>thead {background: #e3e9ff;}
					table#calendar>thead td {width: 30px;text-align:left;}
				table#calendar>tbody {background: #fff;}
					table#calendar>tbody td {border: 1px solid #ddd;}
						table#calendar>tbody td>p {background: #F8F9FF;color:#666;text-align: left;}
						table#calendar>tbody td>div {height:4em;border: 1px solid #eee;border-radius:1px;}
							table#calendar>tbody td>div>p {border-radius: 2px;font-size: 10pt;}

div#right-panel {width:20%}
	div#notepad-panel {border: 2px inset #a9a9a9;border-radius: 2px;padding: 2px;}
</style>
</html>