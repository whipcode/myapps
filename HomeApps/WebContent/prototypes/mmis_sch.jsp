<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
import="my.webapp.homeapps.sys.Constants"
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>MMIS Schedule</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wui/core.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wui/wrappers.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/base.css">
<style type="text/css">
table {border-collapse:collapse;font-family:calibri;color:#333}
td {height:40px;}
td:first-child {padding:0 10px;text-align:right}
.month {text-align:center}
.marker {width:3px;border-top:2px inset #bbb;border-bottom:2px inset #bbb}
.top {border-top:2px inset #bbb;border-left:2px inset #bbb;border-right:2px inset #bbb;width:40px}
.mid {border-left:2px inset #bbb;border-right:2px inset #bbb;width:40px}
.bottom {border-bottom:2px inset #bbb;border-left:2px inset #bbb;border-right:2px inset #bbb;width:40px}
div {position:relative;height:100%}
div.bar {position:absolute;top:8px;left:0;height:20px;margin:0 -3px;border:2px solid #333;background:#fff}
</style>
<script type="text/javascript" src="${pageContext.request.contextPath}/wui/core.js"></script>
<script type="text/javascript">
function initPage() {
	var pageElements = [
 		{tag:'table',elements:[
 			{tag:'tr',elements:[
               	{tag:'td'},
               	{tag:'td'},
               	{tag:'td',className:'month',text:'16'},
               	{tag:'td',className:'month',text:'17'},
               	{tag:'td',className:'month',text:'18'},
               	{tag:'td',className:'month',text:'19'},
               	{tag:'td',className:'month',text:'20'},
               	{tag:'td',className:'month',text:'21'},
               	{tag:'td',className:'month',text:'22'},
               	{tag:'td',className:'month',text:'23'}
  			]},
 			{tag:'tr',elements:[
	           	{tag:'td',text:'Initial Compatibility Test'},
               	{tag:'td',className:'marker'},
               	{tag:'td',className:'top',elements:[{tag:'div',elements:[{tag:'div',className:'bar',style:{width:'42px'}}]}]},
               	{tag:'td',className:'top'},
               	{tag:'td',className:'top'},
               	{tag:'td',className:'top'},
               	{tag:'td',className:'top'},
               	{tag:'td',className:'top'},
               	{tag:'td',className:'top'},
	           	{tag:'td',className:'top'}
			]},
 			{tag:'tr',elements:[
				{tag:'td',text:'Design & Analysis'},
               	{tag:'td',className:'marker'},
               	{tag:'td',className:'mid',elements:[{tag:'div',elements:[{tag:'div',className:'bar',style:{width:'42px'}}]}]},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
	           	{tag:'td',className:'mid'}
 			]},
 			{tag:'tr',elements:[
				{tag:'td',text:'Development & Testing'},
               	{tag:'td',className:'marker'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid',elements:[{tag:'div',elements:[{tag:'div',className:'bar',style:{width:'130px'}}]}]},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
	           	{tag:'td',className:'mid'}
 			]},
 			{tag:'tr',elements:[
				{tag:'td',text:'Pre-Production Compatibility Test'},
               	{tag:'td',className:'marker'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid',elements:[{tag:'div',elements:[{tag:'div',className:'bar',style:{width:'42px'}}]}]},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
	           	{tag:'td',className:'mid'}
 			]},
 			{tag:'tr',elements:[
				{tag:'td',text:'User Acceptance'},
               	{tag:'td',className:'marker'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid',elements:[{tag:'div',elements:[{tag:'div',className:'bar',style:{width:'130px'}}]}]},
               	{tag:'td',className:'mid'},
               	{tag:'td',className:'mid'},
	           	{tag:'td',className:'mid'}
 			]},
 			{tag:'tr',elements:[
				{tag:'td',text:'Production Migration'},
               	{tag:'td',className:'marker'},
               	{tag:'td',className:'bottom'},
               	{tag:'td',className:'bottom'},
               	{tag:'td',className:'bottom'},
               	{tag:'td',className:'bottom'},
               	{tag:'td',className:'bottom'},
               	{tag:'td',className:'bottom'},
               	{tag:'td',className:'bottom'},
	           	{tag:'td',className:'bottom',elements:[{tag:'div',elements:[{tag:'div',className:'bar',style:{width:'16px'}}]}]}
 			]},
 		]}
 	];

	wui.setPageTitle('<%= Constants.appName %> Palette');

	var helper = new DomHelper(document.body);
	helper.createChildElements(pageElements);

}

</script>
</head>
<body onload="initPage();"></body>
</html>