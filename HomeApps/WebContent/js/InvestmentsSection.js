function InvestmentsSection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;

	var _this = this;
	function rowCommElementsFn() {
		return [{tag:'button', type:'button', text:'Delete', on:{click:new CallbackObj(_this,_this.deleteInvestmentRec)}}];
	}
	
	var tableSetting = (new WuiTableSetting())
		.setClass('investmentTable')
		.addColumnDef('comm','',rowCommElementsFn)
		.addColumnDef('bankDate','Investment Date')
		.addColumnDef('desc','Description') 
		.addColumnDef('amount','Amount')
		.addColumnDef('tranxSubcatg','Sub Catg')
		.addColumnDef('remarks','Remarks')
		.addRowEventHandlers({dblclick:new CallbackObj(_this,_this.editInvestmentRec)})
		;
	
	this.components = {
		investmentTable:new WuiTable('investmentTable', tableSetting),
		btnNew:new WuiButton('btnNew','New',new WuiButtonSetting({click:new CallbackObj(this,this.newInvestmentRec)})),
		frmInvestment:new InvestmentForm('investmentForm',{ok:new CallbackObj(this, this.updateRecord),cancel:null}, appData)
	};
}

InvestmentsSection.prototype = new WuiComponent;

InvestmentsSection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'investments',elements:wui.toElements(
		this.components.investmentTable,
		{tag:'div',elements:wui.toElements(this.components.btnNew)},
		this.components.frmInvestment
		)};
	
	return initElements;
};

InvestmentsSection.prototype.refresh = function() {
	var investmentRecs = this.appData.getInvestmentRecs(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	this.components.investmentTable.refresh(investmentRecs);
};

InvestmentsSection.prototype.editInvestmentRec = function(w3cEvent) {
	if (w3cEvent.currentTarget.userData)
		var tr = w3cEvent.currentTarget;
	else
		var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var investmentRec = tr.userData.record;
	this.components.frmInvestment.edit(investmentRec, {mode:'edit'});
};

InvestmentsSection.prototype.newInvestmentRec = function(w3cEvent) {
	var newInvestmentRec = this.appData.newTransaction(this.appData.getSelectedAccountIdx(), 0, new Date(), '', 'Investments', '', '');
	this.components.frmInvestment.edit(newInvestmentRec, {mode:'new'});
};

InvestmentsSection.prototype.updateRecord = function(investmentRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(investmentRec);
		break;
	case 'edit':
		this.appData.updateTransaction(investmentRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

InvestmentsSection.prototype.deleteInvestmentRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var investmentRec = tr.userData.record;
	this.appData.deleteTransaction(investmentRec);
	this.callbackObjs.refreshSections.callback();
};

