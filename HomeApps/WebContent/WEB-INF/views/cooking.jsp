<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>HomeApps - Cooking</title>
<link rel="stylesheet" type="text/css" href="/wui4/css/wui4.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/cooking.css" />
<script type="text/javascript" src="/wui4/js/wui4.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/CookingDao.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/cookingData.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/cooking.js"></script>
<script type="text/javascript">
var appRoot = '${pageContext.request.contextPath}';
</script>
</head>
<body id="body" onload="new Application('body');"></body>
</html>