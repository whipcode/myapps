function ExpensesAppSections(id, appData) {
	WuiComponent.call(this, id);
	
	this.appData = appData;
	
	var callbackObjs = {refreshSections:new CallbackObj(this, this.refresh)};
	
	this.components = {
		accountSummarySection:new AccountSummarySection('accountSummarySection', callbackObjs, appData),
		incomesSection:new IncomesSection('incomesSection', callbackObjs, appData),
		expendituresSection:new ExpendituresSection('expendituresSection', callbackObjs, appData),
		shoppingsSection:new ShoppingsSection('shoppingsSection', callbackObjs, appData),
		investmentsSection:new InvestmentsSection('investmentsSection', callbackObjs, appData),
		transfersSection:new TransfersSection('transfersSection', callbackObjs, appData),
		monthlySummarySection:new MonthlySummarySection('monthlySummarySection', callbackObjs, appData),
		cardSummarySection:new CardSummarySection('cardSummarySection', callbackObjs, appData),
		assetSummarySection:new AssetSummarySection('assetSummarySection', callbackObjs, appData)
	};
}

ExpensesAppSections.prototype = new WuiComponent;

ExpensesAppSections.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'sections',elements:wui.toElements(
		this.components.accountSummarySection,
		this.components.incomesSection,
		this.components.expendituresSection,
		this.components.shoppingsSection,
		this.components.investmentsSection,
		this.components.transfersSection,
		this.components.monthlySummarySection,
		this.components.cardSummarySection,
		this.components.assetSummarySection
		)};

	return initElements;
};

ExpensesAppSections.prototype.refresh = function() {
	for (var c in this.components) {
		var component = this.components[c];
		if (component.refresh)
			component.refresh();
	}
};

ExpensesAppSections.prototype.newTran = function(tranType) {
	switch (tranType) {
	case 'incomes':
		this.components.incomesSection.newIncomeRec();
		break;
	case 'expenditures':
		this.components.expendituresSection.cbNewExpenditureRec();
		break;
	case 'shoppings':
		this.components.shoppingsSection.newShoppingRec();
		break;
	case 'investments':
		this.components.investmentsSection.newInvestmentRec();
		break;
	case 'monthlySummary':
		this.components.monthlySummarySection.cbNewTransactionRec();
		break;
	default:
		alert('Please select a section first. Eg, Incomes');
	}
};