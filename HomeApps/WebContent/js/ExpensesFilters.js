function ExpensesFilters(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;
}

ExpensesFilters.prototype = new WuiComponent;

ExpensesFilters.prototype.getElementDef = function() {
	var elementDef = {tag:'div',className:'filters',elements:wui.toElements(
		{tag:'label',text:'Account: '},
		{tag:'select',id:'selectAccount',on:{change:new CallbackObj(this,this.changeAccount)}},
		{tag:'label',text:'Year: '},
		{tag:'select',id:'selectYear',on:{change:new CallbackObj(this,this.changeYear)}},
		{tag:'label',text:'Month: '},
		{tag:'select',id:'selectMonth',on:{change:new CallbackObj(this,this.changeMonth)}},
		{tag:'button',text:'Save to Excel',on:{click:new CallbackObj(this,this.saveToExcel)}},
		{tag:'button',id:'newTran', text:'New Transaction',on:{click:new CallbackObj(this,this.newTran)}}
		)};
	
	return elementDef;
};

ExpensesFilters.prototype.refreshSelectAccount = function(accountList) {
	var selectAccount = this.getHtmlElement('selectAccount');
	var options = [];
	
	for (var a in accountList) {
		options.push({tag:'option',text:accountList[a],value:accountList[a]});
	}
	
	wui.clearChildElements(selectAccount);
	wui.createHtmlElements(options, selectAccount);
};

ExpensesFilters.prototype.refreshSelectYear = function(yearList) {
	var selectYear = this.getHtmlElement('selectYear');
	var options = [];
	
	for (var a in yearList) {
		options.push({tag:'option',text:yearList[a],value:yearList[a]});
	}
	
	wui.clearChildElements(selectYear);
	wui.createHtmlElements(options, selectYear);
};

ExpensesFilters.prototype.refreshSelectMonth = function(monthList, monthIdx) {
	var selectMonth = this.getHtmlElement('selectMonth');
	var options = [];
	
	for (var m in monthList) {
		options.push({tag:'option',text:monthList[m],value:m});
	}
	
	wui.clearChildElements(selectMonth);
	wui.createHtmlElements(options, selectMonth);
	selectMonth.selectedIndex = monthIdx;
};

ExpensesFilters.prototype.refresh = function() {
	var accountList = this.appData.getAccountList();
	var yearList = this.appData.getYearList();
	
	this.refreshSelectAccount(accountList);
	this.refreshSelectYear(yearList);
	this.refreshSelectMonth(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'], (new Date()).getMonth());

	this.appData.setSelectedAccountIdx(0);
	this.appData.setSelectedYear(yearList[0]);
	this.appData.setSelectedMonth((new Date()).getMonth());
};

ExpensesFilters.prototype.changeAccount = function(w3cEvent) {
	this.appData.setSelectedAccountIdx(w3cEvent.currentTarget.selectedIndex);
	this.callbackObjs.refreshSections.callback();
};

ExpensesFilters.prototype.changeYear = function(w3cEvent) {
	this.appData.setSelectedYear(w3cEvent.currentTarget.value);
	this.callbackObjs.refreshSections.callback();
};

ExpensesFilters.prototype.changeMonth = function(w3cEvent) {
	this.appData.setSelectedMonth(w3cEvent.currentTarget.selectedIndex);
	this.callbackObjs.refreshSections.callback();
};

ExpensesFilters.prototype.saveToExcel = function(w3cEvent) {
	this.callbackObjs.saveToExcel.callback();
};

ExpensesFilters.prototype.newTran = function(w3cEvent) {
	this.callbackObjs.newTran.callback();
};