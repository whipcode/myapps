<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>WorkMan - Home</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/HomePage.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/QuickCalendar.css" />
<script type="text/javascript" src="/wui3/js/ObjectUtil.js"></script>
<script type="text/javascript" src="/wui3/js/DateUtil.js"></script>
<script type="text/javascript" src="/wui3/js/DomHelper.js"></script>
<script type="text/javascript" src="/wui3/js/DomElement.js"></script>
<script type="text/javascript" src="/wui3/js/QuickCalendar.js"></script>
<script type="text/javascript" src="/wui3/js/UserPref.js"></script>
<script type="text/javascript" src="/wui3/js/LabelHelper.js"></script>
<script type="text/javascript">
function run() {
	var quickCalendarPanel = new DomElement();
	quickCalendarPanel.setContext('quickCalendarPanel');
	var quickCalendar = quickCalendarPanel.createComponent(new QuickCalendar(), 'quickCalendar',{snapTo:{BoM:true},numWeeks:6});
}
</script>
</head>
<body onload="run();">
<div id="appLayer" style="position:fixed;top:0px;left:0px;border:0px;height:100%;width:100%">
	<div style="display:table;border:0px;width:100%;height:100%">
		<div style="display:table-cell;border:0px;min-width:300px;max-width:300px;height:100%;border-right:1px outset #fff">
			<div id="loginInfoPanel" style="height:40px;background:#acf;border-bottom:1px solid #aaa;border-bottom-right-radius:3px"></div>
			<div id="jobFileListPanel" style="height:460px"></div>
			<div id="quickCalendarPanel"></div>
		</div>
		<div style="display:table-cell;border:0px;width:100%;height:100%">
			<div id="functionPanel" style="height:30px;background:#77c;border-bottom:1px solid #777"></div>
			<div style="display:table;border:0px;width:100%;height:100%">
				<div style="display:table-cell;border:0px;width:100%;min-width:500px;height:100%;border-right:1px outset #fff"></div>
				<div style="display:table-cell;border:0px;min-width:200px;max-width:200px;height:100%;vertical-align:bottom">
					<textarea rows="10" style="width:98%;max-width:194px"></textarea>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>