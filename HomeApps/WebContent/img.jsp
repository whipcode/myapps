<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/xml" prefix="x" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<style>
img {height:80px}
div#selMsgError {display:none}
</style>
<script type="text/javascript">
function updateimg() {
	var imgs = document.images;
	for (var i=0; i<imgs.length; i++) {
		imgs[i].src=imgs[i].src.replace("L.","T.");
	}
}
</script>
</head>
<body>
<div style="position:fixed;text-align:center;">
<a href="?www=${param.www}&s=${param.s-param.r}&r=${param.r}">${param.s-param.r}~${param.s-1}</a>
<a href="?www=${param.www}&s=${param.s+param.r}&r=${param.r}">${param.s+param.r}~${param.s+param.r+param.r-1}</a>
</div>
<div style="text-align:center;">
<c:forEach begin="0" end="${param.r-1}" var="idx">
<div style="display:inline-block;">
<c:import url="http://${param.www}/photoPreview.php?photo_id=${param.s+idx}" />
<%--<iframe src="http://${param.www}/photoPreview.php?photo_id=${param.s+idx}"></iframe>--%>
</div>
</c:forEach>
</div>
<div style="text-align:center;">
<a href="?www=${param.www}&s=${param.s-param.r}&r=${param.r}">${param.s-param.r}~${param.s-1}</a>
<a href="?www=${param.www}&s=${param.s+param.r}&r=${param.r}">${param.s+param.r}~${param.s+param.r+param.r-1}</a>
</div>
</body>
</html>