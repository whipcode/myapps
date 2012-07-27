function CardTransSection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;
	
	var _this = this;
	function rowCommElementsFn() {
		return [
		        {tag:'button', type:'button', text:'Delete', on:{click:new CallbackObj(_this,_this.deleteExpenditureRec)}}
		        ];
	}
	
	var btnNewSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbNewExpenditureRec)});
	var btnNew = new WuiButton('btnNew','New', btnNewSetting);
	var tableSetting = (new WuiTableSetting())
		.setClass('expenditureTable')
		.addColumnDef('comm',btnNew,rowCommElementsFn)
		.addColumnDef('bankDate','Bank Date')
		.addColumnDef('desc','Description') 
		.addColumnDef('amount','Amount')
		.addColumnDef('tranxSubcatg','Sub Catg')
		.addColumnDef('creditCard','Card')
		.addColumnDef('remarks','Remarks')
		.addRowEventHandlers({dblclick:new CallbackObj(_this,_this.editExpenditureRec)})
		;
	
	var frmExpenditureCallbackObjs = {ok:new CallbackObj(this,this.updateRecord),saveRepeat:new CallbackObj(this,this.saveRepeat),saveRepeatAuto:new CallbackObj(this,this.saveRepeatAuto),cancel:null};
	
	this.components = {
		expenditureTable:new WuiTable('expenditureTable', tableSetting),
		frmExpenditure:new ExpenditureForm('frmExpenditure',frmExpenditureCallbackObjs, appData)
	};
}

CardTransSection.prototype = new WuiComponent;

CardTransSection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'cardTrans',elements:wui.toElements(
		this.components.expenditureTable,
		this.components.frmExpenditure
		)};
	
	return initElements;
};

CardTransSection.prototype.refresh = function() {
	var expenditureRecs = this.appData.getExpenditureRecs(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	this.components.expenditureTable.refresh(expenditureRecs);
};

CardTransSection.prototype.editExpenditureRec = function(w3cEvent) {
	if (w3cEvent.currentTarget.userData)
		var tr = w3cEvent.currentTarget;
	else
		var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var expenditureRec = tr.userData.record;
	this.components.frmExpenditure.edit(expenditureRec, {mode:'edit'});
};

CardTransSection.prototype.cbNewExpenditureRec = function(w3cEvent) {
	var newExpenditureRec = this.appData.newTransaction(this.appData.getSelectedAccountIdx(), 0, new Date(), '', 'Expenditures', 'Basic', '');
	this.components.frmExpenditure.edit(newExpenditureRec, {mode:'new'});
};

CardTransSection.prototype.updateRecord = function(expenditureRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(expenditureRec);
		break;
	case 'edit':
		this.appData.updateTransaction(expenditureRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

CardTransSection.prototype.deleteExpenditureRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var expenditureRec = tr.userData.record;
	this.appData.deleteTransaction(expenditureRec);
	this.callbackObjs.refreshSections.callback();
};

CardTransSection.prototype.saveRepeat = function(expenditureRec, repeatDtl, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransactionRepeatFast(expenditureRec, repeatDtl);
		break;
	case 'edit':
		this.appData.updateTransactionRepeatFast(expenditureRec, repeatDtl);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

CardTransSection.prototype.saveRepeatAuto = function(expenditureRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(expenditureRec);
		break;
	case 'edit':
		this.appData.updateTransactionRepeatAutoFast(expenditureRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

