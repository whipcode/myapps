<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Wui App Prototype</title>
<link rel="stylesheet" type="text/css" href="/wui2/core.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/prototypes/wuiapp.css" />
<script type="text/javascript" src="/wui2/core.js"></script>
<script type="text/javascript" src="/wui2/DomHelper.js"></script>
<script type="text/javascript" src="/wui2/AppManager.js"></script>
<script type="text/javascript" src="/wui2/WuiComponent.js"></script>
<script type="text/javascript" src="/wui2/WuiTable.js"></script>
<script type="text/javascript" src="/wui2/DateUtil.js"></script>
<script type="text/javascript" src="/wui2/StringUtil.js"></script>
<script>
var appManager = new AppManager();
function pageInit() {
	var element = new WuiTable('table1');
	var appSpace = wui.getHtmlElement('appSpace');

	wui.createHtmlElement(element, appSpace);
}
</script>
</head>
<body onload="pageInit();">
<div id="appMenu"></div>
<div id="appSpace">
</div>
</body>
</html>