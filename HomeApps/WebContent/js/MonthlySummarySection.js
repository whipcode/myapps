function MonthlySummarySection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;
	
	var _this = this;
	function rowCommElementsFn() {
		return [
		        {tag:'button', type:'button', text:'Delete', on:{click:new CallbackObj(_this,_this.deleteTransactionRec)}},
		        {tag:'button', type:'button', text:'Edit', on:{click:new CallbackObj(_this,_this.editTransactionRec)}}
		        ];
	}
	
	var btnNewSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbNewTransactionRec)});
	var btnNew = new WuiButton('btnNew','New', btnNewSetting);
	var tableSetting = (new WuiTableSetting())
		.setClass('monthlySummaryTable')
		.addColumnDef('comm',btnNew,rowCommElementsFn)
		.addColumnDef('bankDate','Bank Date')
		.addColumnDef('desc','Description') 
		.addColumnDef('amount','Amount',function(value) {return [{tag:'span',text:wui.format(value),className:(value<0?'neg':'')}];})
		.addColumnDef('tranxCatg','Category')
		.addColumnDef('tranxSubcatg','Sub Catg')
		.addColumnDef('creditCard','Card')
		.addColumnDef('remarks','Remarks')
		;
	
	var frmMonthlySummaryCallbackObjs = {ok:new CallbackObj(this,this.updateRecord),saveRepeat:new CallbackObj(this,this.saveRepeat),saveRepeatAuto:new CallbackObj(this,this.saveRepeatAuto),cancel:null};
	
	this.components = {
		monthlySummaryTable:new WuiTable('monthlySummaryTable', tableSetting),
		frmMonthlySummary:new MonthlySummaryForm('frmMonthlySummary',frmMonthlySummaryCallbackObjs, appData)
	};
	
	this.lastCategory = '';
}

MonthlySummarySection.prototype = new WuiComponent;

MonthlySummarySection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'monthlySummary',elements:wui.toElements(
		this.components.monthlySummaryTable,
		this.components.frmMonthlySummary
		)};
	
	return initElements;
};

MonthlySummarySection.prototype.refresh = function() {
	var transactionRecs = this.appData.getTransactionRecs(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	this.components.monthlySummaryTable.refresh(transactionRecs);
};

MonthlySummarySection.prototype.editTransactionRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var transactionRec = tr.userData.record;
	this.components.frmMonthlySummary.edit(transactionRec, {mode:'edit'});
};

MonthlySummarySection.prototype.cbNewTransactionRec = function(w3cEvent) {
	var newTransactionRec = this.appData.newTransaction(this.appData.getSelectedAccountIdx(), 0, new Date(), '', this.lastCategory, '', '', null, '');
	this.components.frmMonthlySummary.edit(newTransactionRec, {mode:'new'});
};

MonthlySummarySection.prototype.updateRecord = function(transactionRec, token) {
	this.lastCategory = transactionRec.tranxCatg;
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(transactionRec);
		break;
	case 'edit':
		this.appData.updateTransaction(transactionRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

MonthlySummarySection.prototype.deleteTransactionRec = function(w3cEvent) {
	var tr = w3cEvent.currentTarget.parentNode.parentNode;
	var transactionRec = tr.userData.record;
	this.appData.deleteTransaction(transactionRec);
	this.callbackObjs.refreshSections.callback();
};

MonthlySummarySection.prototype.saveRepeat = function(transactionRec, repeatDtl, token) {
	this.lastCategory = transactionRec.tranxCatg;
	switch (token.mode) {
	case 'new':
		this.appData.addTransactionRepeatFast(transactionRec, repeatDtl);
		break;
	case 'edit':
		this.appData.updateTransactionRepeatFast(transactionRec, repeatDtl);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

MonthlySummarySection.prototype.saveRepeatAuto = function(transactionRec, token) {
	this.lastCategory = transactionRec.tranxCatg;
	switch (token.mode) {
	case 'new':
		this.appData.addTransaction(transactionRec);
		break;
	case 'edit':
		this.appData.updateTransactionRepeatAutoFast(transactionRec);
		break;
	}
	this.callbackObjs.refreshSections.callback();
};

function MonthlySummaryForm(id, callbackObjs, appData) {
	WuiComponent.call(this,id);

	this.record = null;
	this.callbackObjs = callbackObjs;
	this.appData = appData;
	this.components = {
		frmRepeat:new TransactionRepeatForm('frmRepeat', {ok:new CallbackObj(this,this.saveRepeat),cancel:null})
	};
	
	this.token = null;
}

MonthlySummaryForm.prototype = new WuiComponent;

MonthlySummaryForm.prototype.getFieldSettings = function() {
	var appData = this.appData;
	var _this = this;
	
	function autoComplete(evt) {
		var htmlElement = evt.currentTarget;
		var tranxCatg = _this.getComponent('tranxCatg');
		var subcatgList = appData.getTranxSubcatgList(tranxCatg.getValue());
		var input;

		if (evt.keyCode < 48) return;
		
		input = htmlElement.value;
		
		if (input.length > 0) {
			for (var i=0; i<subcatgList.length; i++) {
				var idx = subcatgList[i].toLowerCase().indexOf(input.toLowerCase());
				if (idx == 0 && subcatgList[i].length > input.length) {
					htmlElement.value = subcatgList[i];
					htmlElement.setSelectionRange(input.length, subcatgList[i].length);
					return;
				}
			}
		}
	}
	
	var btnSelectSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbSwitchToSelect)});
	var fieldSettings = {
		bankDate:new WuiTextFieldSetting('Bank Date: ',10),
		amount:new WuiTextFieldSetting('Amount: ',10),
		desc:new WuiTextFieldSetting('Description: ',10),
		tranxCatg:new WuiDropdownFieldSetting('Category: ',10, ['Incomes','Expenditures','Shoppings','Investments','Transfers'],'Incomes',null,{change:new CallbackObj(this,this.cbChangeTranxCatg)}),
		tranxSubcatg:new WuiTextFieldSetting('Sub Category: ',10, null, null, {keyup:autoComplete}, [new WuiButton('btnSelect', 'Select', btnSelectSetting)]),
		creditCard:new WuiTextFieldSetting('Card: ',10),
		remarks:new WuiTextFieldSetting('Remarks: ',10)
	};
	
	return fieldSettings;
};

MonthlySummaryForm.prototype.getElementDef = function() {
	var btnTypeSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbSwitchToType)});
	var tranxSubcatgDropdownSettings = new WuiDropdownFieldSetting('Sub Category: ', 10, [], null, null, {change:new CallbackObj(this,this.cbSetTranxSubcatg)}, [new WuiButton('btnType', 'Type', btnTypeSetting)]);

	function genFieldElements(fieldSettings) {
		var elements = [];
		
		for (var name in fieldSettings) {
			switch (name) {
			case 'tranxCatg':
				elements.push(new WuiDropdownField(name, fieldSettings[name]));
				break;
			case 'tranxSubcatg':
				fieldSettings[name].className = 'subcatgTextField';
				elements.push(new WuiTextField(name, fieldSettings[name]));
				tranxSubcatgDropdownSettings.className = 'subcatgDropdownField';
				elements.push(new WuiDropdownField('tranxSubcatgDropdownField', tranxSubcatgDropdownSettings));
				break;
			default:
				elements.push(new WuiTextField(name, fieldSettings[name]));
			}
		}
		
		return elements;
	}
	
	var btnOkSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbUpdate)});
	var btnRepeatSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbRepeat)});
	var btnRepeatAutoSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbRepeatAuto)});
	var btnCancelSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbCancel)});
	
	var initElements = {
		tag:'div',className:'monthlySummaryForm',attr:{state:'hide',subcatgMode:'type'},elements:wui.toElements(
			{tag:'div',className:'window',elements:wui.toElements(
				{tag:'div',className:'editForm',elements:genFieldElements(this.getFieldSettings())},
				{tag:'div',className:'buttons',elements:wui.toElements(
					new WuiButton('btnRepeat', 'Repeat', btnRepeatSetting),
					new WuiButton('btnRepeatAuto', 'Update Repeat Auto', btnRepeatAutoSetting),
					new WuiButton('btnOk', 'OK', btnOkSetting),
					new WuiButton('btnCancel', 'Cancel', btnCancelSetting)
					)}
				)},
			this.components.frmRepeat
		)};
	
	return initElements;
};

MonthlySummaryForm.prototype.show = function() {
	this.htmlElement.setAttribute('state','show');
	this.htmlElement.setAttribute('subcatgMode','type');
	this.htmlElement.className = this.htmlElement.className;
};

MonthlySummaryForm.prototype.hide = function() {
	this.htmlElement.setAttribute('state','hide');
	this.htmlElement.className = this.htmlElement.className;
};

MonthlySummaryForm.prototype.edit = function(record, token) {
	this.record = record;
	this.token = token;
	
	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		textField.setValue(wui.format(record[field]));
	}
	
	this.show();
};

MonthlySummaryForm.prototype.cbUpdate = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
	}

	if (this.callbackObjs.ok)
		this.callbackObjs.ok.callback(this.record, this.token);
};

MonthlySummaryForm.prototype.cbCancel = function(w3cEvent) {
	this.hide();
	
	if (this.callbackObjs.cancel)
		this.callbackObjs.cancel.callback(this.record, this.token);
};

MonthlySummaryForm.prototype.cbRepeat = function(w3cEvent) {
	this.components.frmRepeat.ask();
};

MonthlySummaryForm.prototype.cbRepeatAuto = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
	}

	if (this.callbackObjs.saveRepeatAuto)
		this.callbackObjs.saveRepeatAuto.callback(this.record, this.token);
};

MonthlySummaryForm.prototype.saveRepeat = function(repeatDtl) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
	}

	if (this.callbackObjs.saveRepeat)
		this.callbackObjs.saveRepeat.callback(this.record, repeatDtl, this.token);
};

MonthlySummaryForm.prototype.cbSwitchToType = function(w3cEvent) {
	this.htmlElement.setAttribute('subcatgMode','type');
	this.htmlElement.className = this.htmlElement.className;
};

MonthlySummaryForm.prototype.cbChangeTranxCatg = function(w3cEvent) {
	var tranxCatg = this.getComponent('tranxCatg');
	var textField = this.getComponent('tranxSubcatg');
	var dropdownField = this.getComponent('tranxSubcatgDropdownField');
	var subcatgList = this.appData.getTranxSubcatgList(tranxCatg.getValue());
	var targetValue = textField.getValue();
	
	dropdownField.setOptions(subcatgList);
	
	if (subcatgList.length > 0) {
		var i = subcatgList.length - 1;
		while (i >= 0 && subcatgList[i] > targetValue) {
			i--;
		}
		dropdownField.setValue(subcatgList[i]);
	}
};

MonthlySummaryForm.prototype.cbSwitchToSelect = function(w3cEvent) {
	var tranxCatg = this.getComponent('tranxCatg');
	var textField = this.getComponent('tranxSubcatg');
	var dropdownField = this.getComponent('tranxSubcatgDropdownField');
	var subcatgList = this.appData.getTranxSubcatgList(tranxCatg.getValue());
	var targetValue = textField.getValue();
	
	dropdownField.setOptions(subcatgList);
	
	if (subcatgList.length > 0) {
		var i = subcatgList.length - 1;
		while (i >= 0 && subcatgList[i] > targetValue) {
			i--;
		}
		dropdownField.setValue(subcatgList[i]);
	}
	
	this.htmlElement.setAttribute('subcatgMode','select');
	this.htmlElement.className = this.htmlElement.className;
};

MonthlySummaryForm.prototype.cbSetTranxSubcatg = function(w3cEvent) {
	var textField = this.getComponent('tranxSubcatg');
	var dropdownField = this.getComponent('tranxSubcatgDropdownField');

	textField.setValue(dropdownField.getValue());
};
