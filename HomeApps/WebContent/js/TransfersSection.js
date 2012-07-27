function TransfersSection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;

	var _this = this;
	function rowCommElementsFn() {
		return [{tag:'button', type:'button', text:'Delete', on:{click:new CallbackObj(_this,_this.deleteTransferRec)}}];
	}
	
	var tableSetting = (new WuiTableSetting())
		.setClass('transferTable')
		.addColumnDef('comm','',rowCommElementsFn)
		.addColumnDef('bankDate','Transfer Date')
		.addColumnDef('desc','Description') 
		.addColumnDef('amount','Amount')
		.addColumnDef('tranxSubcatg','Sub Catg')
		.addColumnDef('remarks','Remarks')
		.addColumnDef('followup','Follow Up')
		.addRowEventHandlers({dblclick:new CallbackObj(_this,_this.editTransferRec)})
		;
	
	this.components = {
		transferTable:new WuiTable('transferTable', tableSetting),
		btnNew:new WuiButton('btnNew','New',new WuiButtonSetting({click:new CallbackObj(this,this.newTransferRec)})),
		frmTransfer:new TransferForm('transferForm',{ok:new CallbackObj(this, this.updateRecord),cancel:null})
	};
}

TransfersSection.prototype = new WuiComponent;

TransfersSection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'transfers',elements:wui.toElements(
		this.components.transferTable,
		{tag:'div',elements:wui.toElements(this.components.btnNew)},
		this.components.frmTransfer
		)};
	
	return initElements;
};

TransfersSection.prototype.refresh = function() {
	var transferRecs = this.appData.getTransferRecs(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	this.components.transferTable.refresh(transferRecs);
};

TransfersSection.prototype.editTransferRec = function(w3cEvent) {
	if (w3cEvent.currentTarget.userData)
		var tr = w3cEvent.currentTarget;
	else
		var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var transferRec = tr.userData.record;
	this.components.frmTransfer.edit(transferRec, {mode:'edit'});
};

TransfersSection.prototype.newTransferRec = function(w3cEvent) {
	var newTransferRec = this.appData.newTransaction(this.appData.getSelectedAccountIdx(), 0, new Date(), '', 'Transfers', '', '');
	this.components.frmTransfer.edit(newTransferRec, {mode:'new'});
};

TransfersSection.prototype.updateRecord = function(transferRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(transferRec);
		break;
	case 'edit':
		this.appData.updateTransaction(transferRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

TransfersSection.prototype.deleteTransferRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var transferRec = tr.userData.record;
	this.appData.deleteTransaction(transferRec);
	this.callbackObjs.refreshSections.callback();
};

