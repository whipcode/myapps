<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>HomeApps Introduction (prototype)</title>
<style type="text/css">
body,p {margin:0;padding:0}
.wrapper {position:fixed;top:0;left:0;width:100%;height:100%;text-align:center}
.app {display:inline-block;width:100px;height:80px;border-radius:5px;background:#bcf;margin:20px;vertical-align:middle;}
.dummy {display:inline-block;width:1px;height:100%;vertical-align:middle}
p.v-middle {display:inline-block;vertical-algin:middle}
</style>
</head>
<body>
<div class="wrapper">
<div class="app"><p class="v-middle">Home</p><div class="dummy"></div></div>
<div class="app"><p class="v-middle">PIM</p><div class="dummy"></div></div>
<div class="app"><p class="v-middle">Household</p><div class="dummy"></div></div>
<div class="dummy"></div>
</div>
</body>
</html>