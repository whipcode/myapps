<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
import="my.webapp.homeapps.sys.Constants"
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/wui/core.css">
<link rel="stylesheet" type="text/css" href="/wui/wrappers.css">
<link rel="stylesheet" type="text/css" href="/wui/mini_calendar.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/base.css">
<style>
#appContainer {position:fixed;width:100%;height:100%;background:#fff;overflow:auto}
#jobbook {position:relative;width:700px;height:680px;margin:5px auto;overflow:hidden}
#pageContainer {position:absolute;left:0;top:0;width:666px;height:676px;border:2px outset #ccc;border-radius:8px 2px 2px 8px;background:#fcf8d9}
#pageHeader {height:50px;padding:8px;border-bottom:4px double #faf;font-size:1.5em;font-weight:bold;line-height:2em}
#contentContainer {height:605px;padding:0 0 0 5px}
#itemMaintContent {height:100%;overflow:auto}
.catalogContainer {}
.catalogName {display:inline-block;border-radius:4px;background:#eec;padding:0.2em 0.5em}
.catalogSorter {height:1px;margin:3px}
.catalogInserter {height:1px;margin:3px}
.catalogPlaceholder {height:1.7em;margin:3px}
.catalogPlaceholder:hover {border:1px dashed #888}
.textNewCatg {}
.itemContainer {}
.itemSorter {width:1px;margin:2px}
.itemInserter {display:inline-block;width:1px;height:1em;margin:2px}
.itemPlaceholder {display:inline-block;border-radius:8px;width:100px;height:1.7em;margin:2px}
.itemPlaceholder:hover {border:1px inset #ccc;background:#ccc}
.textNewItem {width:95px}
#shoppingListContent {height:100%;overflow:auto}
p.items-header {display:block;margin:4px;font-size:1.8em;font-weight:bold}
.item {display:inline-block;border:1px outset #fff;border-radius:10px;background:#fff;margin:3px;padding:3px 8px;font-size:1.4em}
#flipperContainer {position:absolute;left:670px;top:0;width:30px;height:100%}
a.flipper {display:block;border:2px outset #888;margin:0 0 10px -2px;border-radius:0 10px 10px 0;background:#ffd;padding:2px 2px;font-weight:bold;text-align:center}
a.flipper:link,a.flipper:visited {text-decoration:none;color:#000}
a.flipper.current {border-left:transparent}
.hidden {display:none}
#miniCalendar {position:fixed;top:5px;left:5px}
</style>
<script type="text/javascript" src="/wui/core.js"></script>
<script type="text/javascript" src="/wui/mini_calendar.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/calendarDao.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script type="text/javascript">
var catalogCtlr = new Object();
var modelCtlr = new Object();

modelCtlr.setModel = function(model) {};
modelCtlr.appendCatalogs = function(catalogs) {};
modelCtlr.appendItems = function(catalog, items) {};
catalogCtlr.appendCatalogs = function(catalogs) {
	var inserter = wui.elements['catgInserter'];

	for (var i in catalogs) {
		var catalog = catalogs[i];
		inserter.insertSiblingElements([
			{tag:'div',className:'catalogSorter'},
			{tag:'div',className:'catalogContainer',elements:[
				{tag:'p',className:'catalogName',text:catalog.name},
				{tag:'p',className:'itemContainer',elements:[
					{tag:'span',className:'itemInserter',objName:'itemInserter'},
					{tag:'span',className:'itemPlaceholder',on:{click:addNewItem}}
				]}
			]}
		]);
	}
};

function createNewCatg(newCatgName) {
	catalogCtl.appendCatalogs([{name:newCatgName,items:[]}]);
}

function createNewItem(newItemName) {
	itemCtrl.appendItems([{name:newItemName,prices:[]}]);
}

function checkkey(w3cEvent) {
	if (w3cEvent.keyCode == 13) {
		switch (w3cEvent.currentTarget.className) {
		case 'textNewCatg':
			createNewCatg(w3cEvent.currentTarget.value);
			break;
		case 'textNewItem':
			createNewItem(w3cEvent.currentTarget.value);
			break;
		}
	}
}

function cancelNewCatg(w3cEvent) {
	var catgPlaceholder = wui.elements['catgPlaceholder'];
	w3cEvent.currentTarget.removeEventListener('blur',cancelNewCatg,false);
	catgPlaceholder.clearElements();
	catgPlaceholder.editing = false;
}

function addNewCatg(w3cEvent) {
	var catgPlaceholder = wui.elements['catgPlaceholder'];

	if (!catgPlaceholder.editing) {
		catgPlaceholder.editing = true;
		catgPlaceholder.createElements([
			{tag:'input',type:'text',name:'textNewCatg',className:'textNewCatg',objName:'textNewCatg',on:{keydown:checkkey,blur:cancelNewCatg}}
		]);

		wui.elements['textNewCatg'].htmlElement.focus();
	}
}

function cancelNewItem(w3cEvent) {
	w3cEvent.currentTarget.removeEventListener('blur',cancelNewItem,false);
	var itemPlaceholder = w3cEvent.currentTarget.parentNode.wuiElement;
	itemPlaceholder.clearElements();
	itemPlaceholder.editing = false;
}

function addNewItem(w3cEvent) {
	var itemPlaceholder = w3cEvent.currentTarget.wuiElement;

	if (!itemPlaceholder.editing) {
		itemPlaceholder.editing = true;
		itemPlaceholder.createElements([
			{tag:'input',type:'text',name:'textNewItem',className:'textNewItem',objName:'textNewItem',on:{keydown:checkkey,blur:cancelNewItem}}
		]);

		wui.elements['textNewItem'].htmlElement.focus();
	}
}

function flippers() {
	var flippers = [{tag:'a',id:'itemMaintFlipper',className:'flipper',href:'#',text:'家居用品'},
		    		{tag:'a',id:'itemMaintFlipper',className:'flipper',href:'#',text:'旅行用品'},
		    		{tag:'a',id:'itemMaintFlipper',className:'flipper',href:'#',text:'辦公室用品'},
		    		{tag:'a',id:'shoppingListFlipper',className:'flipper',href:'#',text:'購物清單'}];

	return flippers;
}

function init() {
	var pageElements = [
		{tag:'div',id:'appContainer',elements:[
			{tag:'div',id:'jobbook',elements:[
		    	{tag:'div',id:'pageContainer',elements:[
		    		{tag:'div',id:'pageHeader',text:'家居用品'},
		    		{tag:'div',id:'contentContainer',objName:'contentContainer',elements:[
    		    		{tag:'div',id:'itemMaintContent',objName:'itemMaintContent',elements:[
							{tag:'div',className:'catalogInserter',objName:'catgInserter'},
							{tag:'div',className:'catalogPlaceholder',objName:'catgPlaceholder',on:{click:addNewCatg}}
						]},
    		    		{tag:'div',id:'shoppingListContent',objName:'shoppingListContent',className:'hidden'},
  		    		]}
		    	]},
		    	{tag:'div',id:'flipperContainer',objName:'flipperContainer',elements:flippers()}
			]}
		]},
		{tag:'div',id:'miniCalendar',elements:wui.widgets.miniCalendar()}
	];

	wui.setPageTitle('<%= Constants.appName %> Maria');
	wui.page.init();
	wui.page.createElements(pageElements);
};
</script>
</head>
<body onload="init();"></body>
</html>