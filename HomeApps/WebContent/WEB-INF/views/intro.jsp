<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
import="my.webapp.homeapps.sys.Constants"
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>HomeApps Introduction</title>
<link rel="stylesheet" type="text/css" href="/wui2/core.css">
<link rel="stylesheet" type="text/css" href="/wui2/wrappers.css">
<style type="text/css">
.app {display:inline-table;width:120px;height:80px;border-radius:5px;background:#cdf;margin:20px;vertical-align:middle;box-shadow:1px 1px 1px #aaa}
.app>a {display:table-cell;text-align:center;vertical-align:middle}
</style>
</head>
<body class="fixed maximized">
<div class="wrapper with-columns maximized">
	<div class="wrapper column middle center">
		<div class="app"><a class="v-middle" href="home">Home</a></div>
		<div class="app"><a class="v-middle" href="pim">PIM</a></div>
		<div class="app"><a class="v-middle" href="maria">Inventory Maria</a></div>
		<div class="app"><a class="v-middle" href="expenses">Expenses</a></div>
		<div class="app"><a class="v-middle" href="expenses2">Expenses v2</a></div>
		<div class="app"><a class="v-middle" href="cooking">Cooking</a></div>
		<div class="app"><a class="v-middle" href="query">Query</a></div>
	</div>
</div>
</body>
</html>