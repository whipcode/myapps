<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
import="my.webapp.homeapps.sys.Constants"
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wui/core.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wui/wrappers.css">
<style>
#appContainer {position:fixed;width:100%;height:100%;background:#ffe}
#jobbook {position:relative;width:700px;height:680px;margin:5px auto}
#pageContainer {position:absolute;left:0;top:0;width:570px;height:100%;border:2px outset #ccc;border-radius:8px 2px 2px 8px;background:#f7f4d8}
#pageHeader {height:50px;padding:8px;border-bottom:4px double #faf}
#contentContainer {}
.item-category {}
p.items-header {display:block;margin:4px;font-size:1.8em;font-weight:bold}
.item {display:inline-block;border:1px outset #fff;border-radius:10px;background:#fff;margin:3px;padding:3px 8px;font-size:1.4em}
#flipperContainer {position:absolute;left:574px;top:0;width:30px;height:100%}
a.flipper {display:block;border:2px outset #888;margin:0 0 10px -2px;border-radius:0 10px 10px 0;background:#ffd;padding:2px 2px;font-weight:bold;text-align:center}
a.flipper:link,a.flipper:visited {text-decoration:none;color:#000}
a.flipper.current {border-left:transparent}
</style>
<script type="text/javascript" src="${pageContext.request.contextPath}/wui/core.js"></script>
<script type="text/javascript">
function init() {
	var pageElements = [
		{tag:'div',id:'appContainer',className:'',elements:[
		    {tag:'div',id:'jobbook',className:'jobbook',elements:[
		    	{tag:'div',id:'pageContainer',className:'',elements:[
		    	    {tag:'div',id:'pageHeader',className:''},
		    	    {tag:'div',id:'contentContainer',className:'',elements:[
    		    		{tag:'div',id:'itemMaintContent',className:''},
    		    		{tag:'div',id:'shoppingListContent',className:''},
  		    	    ]}
		    	]},
		    	{tag:'div',id:'flipperContainer',elements:[
		    		{tag:'a',id:'itemMaintFlipper',className:'flipper',href:'#',text:'用品淸單'},
		    		{tag:'a',id:'shoppingListFlipper',className:'flipper',href:'#',text:'購買清單'}
		        ]}
		    ]}
	    ]}
    ];
	                                                                        		  
	wui.setPageTitle('<%= Constants.appName %> Maria');
	wui.page.init();
	wui.page.createElements(pageElements);
};
</script>
</head>
<body onload="init();">
</body>
</html>