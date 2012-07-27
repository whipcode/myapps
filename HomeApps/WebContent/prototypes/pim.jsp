<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>PIM Prototype</title>
</head>
<body>
<div id="notice-bar" class="wrapper">
	<ul>
		<li>events</li>
		<li>emails</li>
		<li>msgs</li>
	</ul>
</div>
<div id="body" class="column-table">
	<div id="left-panel" class="column">
	</div>
	<div id="mid-panel" class="column">
		<div id="event-calendar" class="widget">
			<div id="event-calendar-com-bar" class="inline-blocks-wrapper">
				<a href="" class="button inline-block">&lt;&lt;</a>
				<a href="" class="inline-block">January 2011</a>
				<a href="" class="button inline-block">&gt;&gt;</a>
			</div>
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
								<!-- <p>Note</p> -->
								</div>
								</td>
							</c:forEach>
						</tr>
					</c:forEach>
				</tbody>
			</table>
		</div>
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
* {margin:0}
h1,h2,h3 {font-size:1em}

div.plate {position:fixed;top:0;left;0;width:100%;height:100%;z-index:999;}

div.wrapper {margin:0}

div.widget {margin:4px 0}

div.inline-blocks-wrapper {margin:0;vertical-align:top;}
	div.inline-blocks-wrapper>.inline-block {display:inline-block;margin:0;}	

div.column-table {display:table;margin:0;width:100%}
	div.column-table>.column {display:table-cell;margin:0}

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