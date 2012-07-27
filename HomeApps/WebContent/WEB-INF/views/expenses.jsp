<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Expenses</title>
<link rel="stylesheet" type="text/css" href="/wui2/core.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/ExpensesApp.css">
<style>
body {background:url(${pageContext.request.contextPath}/css/bg.png)}
#appsMenu {width:90%;min-width:700px;margin:0 auto;height:10px;border-radius:0 0 5px 5px;background:#bbf}
#appsSpace {position:fixed;left:0;top:10px;right:0;bottom:0;overflow:hidden}
#expensesAppContainer {position:absolute;top:10px;bottom:10px;left:20px;right:20px;min-width:980px;font-size:0.8em;border:1px solid #aaa;border-radius:5px;padding:8px;box-shadow:2px 2px 3px rgba(100,100,100,0.85);background:#fff}
</style>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/BankAccountDao.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script type="text/javascript" src="/wui2/core.js"></script>
<script type="text/javascript" src="/wui2/DomHelper.js"></script>
<script type="text/javascript" src="/wui2/WuiComponent.js"></script>
<script type="text/javascript" src="/wui2/WuiButton.js"></script>
<script type="text/javascript" src="/wui2/WuiTextField.js"></script>
<script type="text/javascript" src="/wui2/WuiCheckboxField.js"></script>
<script type="text/javascript" src="/wui2/WuiDropdownField.js"></script>
<script type="text/javascript" src="/wui2/WuiTable.js"></script>
<script type="text/javascript" src="/wui2/DateUtil.js"></script>
<script type="text/javascript" src="/wui2/StringUtil.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpensesData.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpensesMenu.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpensesFilters.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpensesAppSections.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/AccountSummarySection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/IncomeForm.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/IncomesSection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpenditureForm.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/TransactionRepeatForm.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpendituresSection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ShoppingForm.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ShoppingsSection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/InvestmentForm.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/InvestmentsSection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/TransferForm.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/TransfersSection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/MonthlySummarySection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/CardTransSection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/CardSummarySection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/AssetSummarySection.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ExpensesApp.js"></script>
<script>
function initPage() {
	var expenses = new ExpensesApp('app1');
	expenses.setContextRoot('${pageContext.request.contextPath}');
	var appsSpace = wui.getHtmlElement('expensesAppContainer');
	expenses.init(appsSpace);
	expenses.run();
}
</script>
</head>
<body onload="initPage();">
<div id="appsMenu"></div>
<div id="appsSpace">
<div id="expensesAppContainer"></div>
</div>
</body>
</html>