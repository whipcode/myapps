<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Event Calendar Prototype</title>
</head>
<body style="margin:10px">
<div id="event-calendar" style="background:#bcf;padding:5px;border-radius:5px;">
	<div id="com-bar" style="">
	Command Bar
	</div>
	<table id="calendar" style="border-collapse:collapse;width:100%">
		<thead style="background:#e3e9ff;">
			<tr>
				<c:forEach items="Sun,Mon,Tue,Wed,Thu,Fri,Sat" var="weekday">
				<td style="width:30px;text-align:left">${weekday}</td>
				</c:forEach>
			</tr>
		</thead>
		<tbody style="background:#fff;">
			<c:forEach begin="0" end="4" var="week">
			<tr>
				<c:forEach begin="${week*7+1}" end="${week*7+7}" var="day">
				<td style="border:1px solid #ddd">
					<p style="background:#F8F9FF;color:666;text-align:left">${day}</p>
					<div style="width:100%;height:6em">
						<p style="background:#65ad89;color:#fff;border-radius:2px;padding:2px;font-size:10pt;">Note</p>
					</div>
				</td>
				</c:forEach>
			</tr>
			</c:forEach>
		</tbody>
	</table>
</div>
</body>
<style>
* {margin:0;font-family:calibri}
</style>
</html>