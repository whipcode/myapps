<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Expenses</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/expenses2.css" />
<script type="text/javascript" src="/wui5/js/wui5.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/BankAccountDao.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/expenses2Data.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/expenses2.js"></script>
<script type="text/javascript">
var contextRoot = '${pageContext.request.contextPath}';
</script>
</head>
<body id="body" onload="new Expenses2('body');"></body>
</html>