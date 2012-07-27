<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
import="my.webapp.homeapps.sys.Constants"
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Color Palette</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wui/core.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wui/wrappers.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/base.css">
<style type="text/css">
#colorPanel {position:fixed;left:0;top:0;width:100%;background:#909090;border:1px outset #bbb}
#hueCtrl {display:block;margin: 10 auto;}
#hueBar {display:inline-block;height:20px;border:1px solid #888;vertical-align:middle}
#hueBar>div {display:inline-block;width:2px;height:100%}
#hueBar>div:hover {border:1px dotted #fff;margin:-1px;z-index:9}
#preview {display:inline-block;width:80px;height:40px;margin:2px;vertical-align:middle;text-align:center}
#saturationCtrl {display:block;margin: 10 auto;}
#saturationBar {display:inline-block;height:20px;border:1px solid #888;vertical-align:middle}
#saturationBar>div {display:inline-block;width:2px;height:100%}
#saturationBar>div:hover {border:1px dotted #fff;margin:-1px;z-index:9}
#valueCtrl {display:block;margin: 10 auto;}
#valueBar {display:inline-block;height:20px;border:1px solid #888;vertical-align:middle}
#valueBar>div {display:inline-block;width:2px;height:100%}
#valueBar>div:hover {border:1px dotted #fff;margin:-1px;z-index:9}
</style>
<script type="text/javascript" src="${pageContext.request.contextPath}/wui/core.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/color.js"></script>
<script type="text/javascript">
var c = new Color();
var previewHue = 0;
var previewSaturation = c.hsv.SATURATION;
var previewValue = c.hsv.VALUE;

function eventSetColor(w3cEvent) {
	previewHue = w3cEvent.currentTarget.userVar['hue']||previewHue;
	previewSaturation = w3cEvent.currentTarget.userVar['saturation']||previewSaturation;
	previewValue = w3cEvent.currentTarget.userVar['value']||previewValue;
	c.setHSV(previewHue,previewSaturation,previewValue);
	document.getElementById('rgbValue').value = '#'+c.toRGB();
	document.body.style.backgroundColor = '#'+c.toRGB();
	drawSaturationBar();
	drawValueBar();
}

function drawHueBar() {
	var helper = new DomHelper('hueBar');
	var c = new Color();

	helper.clearChildElements();
	for (h=0; h<c.hsv.HUE; h++) {
		c.setHSV(h,c.hsv.SATURATION,c.hsv.VALUE);
		helper.createChildElements([{tag:'div',style:{backgroundColor:'#'+c.toRGB()},on:{click:eventSetColor,mouseover:preview},userVar:{hue:h}}]);
	}
}

function drawSaturationBar() {
	var helper = new DomHelper('saturationBar');
	var c = new Color();

	helper.clearChildElements();
	for (s=0; s<c.hsv.SATURATION; s++) {
		c.setHSV(previewHue,s,c.hsv.VALUE);
		helper.createChildElements([{tag:'div',style:{backgroundColor:'#'+c.toRGB()},on:{click:eventSetColor,mouseover:preview},userVar:{saturation:s}}]);
	}
}

function drawValueBar() {
	var helper = new DomHelper('valueBar');
	var c = new Color();

	helper.clearChildElements();
	for (v=0; v<c.hsv.VALUE; v++) {
		c.setHSV(previewHue,previewSaturation,v);
		helper.createChildElements([{tag:'div',style:{backgroundColor:'#'+c.toRGB()},on:{click:eventSetColor,mouseover:preview},userVar:{value:v}}]);
	}
}

function preview(w3cEvent) {
	var h = w3cEvent.currentTarget.userVar['hue']||previewHue;
	var s = w3cEvent.currentTarget.userVar['saturation']||previewSaturation;
	var v = w3cEvent.currentTarget.userVar['value']||previewValue;
	c.setHSV(h,s,v);
	var helper = new DomHelper('preview');
	helper.htmlElement.style.backgroundColor = '#'+c.toRGB();
}

function initPage() {
	var pageElements = [
 		{tag:'div',id:'colorPanel',elements:[
 			{tag:'div',id:'hueCtrl',elements:[
                 	{tag:'div',id:'hueBar',objName:'hueBar'},
                 	{tag:'div',id:'preview',objName:'preview'}
  			]},
  			{tag:'table',elements:
  	  			[{tag:'tr',elements:
  	  	  			[{tag:'td',elements:
  	  	  	  			[{tag:'div',id:'saturationCtrl',elements:[{tag:'div',id:'saturationBar',objName:'saturationBar'}]}]},
  	  	  			{tag:'td',elements:
  	  	  	  			[{tag:'div',id:'valueCtrl',elements:[{tag:'div',id:'valueBar',objName:'valueBar'}]}]},
  	  	  	  		{tag:'td',elements:
  	  	  	  	  		[{tag:'input',type:'text',id:'rgbValue',value:'#'+c.toRGB()}]}
  	  	  	  	  	]
  	  	  	  	}]
   	  	  	}
   	  	  ]}
	];

 	var helper = new DomHelper(document.body);

	wui.setPageTitle('<%= Constants.appName %> Palette');
	helper.createChildElements(pageElements);

	drawHueBar();
	drawSaturationBar();
	drawValueBar();
}

</script>
</head>
<body onload="initPage();"></body>
</html>