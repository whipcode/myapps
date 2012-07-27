function IncomesSection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;

	var _this = this;
	function rowCommElementsFn() {
		return [
		        {tag:'button', type:'button', text:'Delete', on:{click:new CallbackObj(_this,_this.deleteIncomeRec)}}
		        ];
	}
	
	var btnNew = new WuiButton('btnNew','New',new WuiButtonSetting({click:new CallbackObj(this,this.newIncomeRec)}));
	var tableSetting = (new WuiTableSetting())
	.setClass('incomeTable')
	.addColumnDef('comm',btnNew,rowCommElementsFn)
	.addColumnDef('bankDate','Bank Date')
	.addColumnDef('desc','Description')
	.addColumnDef('amount','Amount')
	.addColumnDef('tranxSubcatg','Sub Catg')
	.addColumnDef('remarks','Remarks')
	.addRowEventHandlers({dblclick:new CallbackObj(_this,_this.editIncomeRec)})
	;
	
	this.components = {
		incomeTable:new WuiTable('incomeTable', tableSetting),
		frmIncome:new IncomeForm('incomeForm',{ok:new CallbackObj(this, this.updateRecord),saveRepeat:new CallbackObj(this,this.saveRepeat),saveRepeatAuto:new CallbackObj(this,this.saveRepeatAuto),cancel:null}, appData)
	};
}

IncomesSection.prototype = new WuiComponent;

IncomesSection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'incomes',elements:wui.toElements(
		this.components.incomeTable,
		this.components.frmIncome
		)};
	
	return initElements;
};

IncomesSection.prototype.refresh = function() {
	var incomeRecs = this.appData.getIncomeRecs(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	this.components.incomeTable.refresh(incomeRecs);
};

IncomesSection.prototype.editIncomeRec = function(w3cEvent) {
	if (w3cEvent.currentTarget.userData)
		var tr = w3cEvent.currentTarget;
	else
		var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var incomeRec = tr.userData.record;
	this.components.frmIncome.edit(incomeRec, {mode:'edit'});
};

IncomesSection.prototype.newIncomeRec = function(w3cEvent) {
	var newIncomeRec = this.appData.newTransaction(this.appData.getSelectedAccountIdx(), 0, new Date(), '', 'Incomes', 'Salary', '');
	this.components.frmIncome.edit(newIncomeRec, {mode:'new'});
};

IncomesSection.prototype.updateRecord = function(incomeRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(incomeRec);
		break;
	case 'edit':
		this.appData.updateTransaction(incomeRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

IncomesSection.prototype.deleteIncomeRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var incomeRec = tr.userData.record;
	this.appData.deleteTransaction(incomeRec);
	this.callbackObjs.refreshSections.callback();
};

IncomesSection.prototype.saveRepeat = function(incomeRec, repeatDtl, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransactionRepeatFast(incomeRec, repeatDtl);
		break;
	case 'edit':
		this.appData.updateTransactionRepeatFast(incomeRec, repeatDtl);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

IncomesSection.prototype.saveRepeatAuto = function(incomeRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(incomeRec);
		break;
	case 'edit':
		this.appData.updateTransactionRepeatAutoFast(incomeRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

