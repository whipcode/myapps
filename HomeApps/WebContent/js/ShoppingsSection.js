function ShoppingsSection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	this.callbackObjs = callbackObjs;
	this.appData = appData;

	var _this = this;
	function rowCommElementsFn() {
		return [{tag:'button', type:'button', text:'Delete', on:{click:new CallbackObj(_this,_this.deleteShoppingRec)}}];
	}
	
	var btnNew = new WuiButton('btnNew','New',new WuiButtonSetting({click:new CallbackObj(this,this.newShoppingRec)}));
	var tableSetting = (new WuiTableSetting())
		.setClass('shoppingTable')
		.addColumnDef('comm',btnNew,rowCommElementsFn)
		.addColumnDef('bankDate','Bank Date')
		.addColumnDef('desc','Description') 
		.addColumnDef('amount','Amount')
		.addColumnDef('tranxSubcatg','Sub Catg')
		.addColumnDef('creditCard','Card')
		.addColumnDef('remarks','Remarks')
		.addRowEventHandlers({dblclick:new CallbackObj(_this,_this.editShoppingRec)})
		;
	
	this.components = {
		shoppingTable:new WuiTable('shoppingTable', tableSetting),
		frmShopping:new ShoppingForm('frmShopping',{ok:new CallbackObj(this, this.updateRecord),cancel:null}, appData)
	};
}

ShoppingsSection.prototype = new WuiComponent;

ShoppingsSection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'shoppings',elements:wui.toElements(
		this.components.shoppingTable,
		this.components.frmShopping
		)};
	
	return initElements;
};

ShoppingsSection.prototype.refresh = function() {
	var shoppingRecs = this.appData.getShoppingRecs(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	this.components.shoppingTable.refresh(shoppingRecs);
};

ShoppingsSection.prototype.editShoppingRec = function(w3cEvent) {
	if (w3cEvent.currentTarget.userData)
		var tr = w3cEvent.currentTarget;
	else
		var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var shoppingRec = tr.userData.record;
	this.components.frmShopping.edit(shoppingRec, {mode:'edit'});
};

ShoppingsSection.prototype.newShoppingRec = function(w3cEvent) {
	var newShoppingRec = this.appData.newTransaction(this.appData.getSelectedAccountIdx(), -0, new Date(), '', 'Shoppings', '', '', null, '');
	this.components.frmShopping.edit(newShoppingRec, {mode:'new'});
};

ShoppingsSection.prototype.updateRecord = function(shoppingRec, token) {
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(shoppingRec);
		break;
	case 'edit':
		this.appData.updateTransaction(shoppingRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

ShoppingsSection.prototype.deleteShoppingRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var shoppingRec = tr.userData.record;
	this.appData.deleteTransaction(shoppingRec);
	this.callbackObjs.refreshSections.callback();
};

