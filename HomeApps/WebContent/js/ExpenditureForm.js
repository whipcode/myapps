function ExpenditureForm(id, callbackObjs, appData) {
	WuiComponent.call(this,id);

	this.record = null;
	this.callbackObjs = callbackObjs;
	this.appData = appData;
	this.components = {
		frmRepeat:new TransactionRepeatForm('frmRepeat', {ok:new CallbackObj(this,this.saveRepeat),cancel:null})
	};
	
	this.token = null;
}

ExpenditureForm.prototype = new WuiComponent;

ExpenditureForm.prototype.getFieldSettings = function() {
	var appData = this.appData;
	
	function autoComplete(evt) {
		var htmlElement = evt.currentTarget;
		var subcatgList = appData.getTranxSubcatgList('Expenditures');
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
		tranxSubcatg:new WuiTextFieldSetting('Sub Category: ',10, null, null, {keyup:autoComplete}, [new WuiButton('btnSelect', 'Select', btnSelectSetting)]),
		creditCard:new WuiTextFieldSetting('Card: ',10),
		remarks:new WuiTextFieldSetting('Remarks: ',10)
	};
	
	return fieldSettings;
};

ExpenditureForm.prototype.getElementDef = function() {
	var btnTypeSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbSwitchToType)});
	var tranxSubcatgDropdownSettings = new WuiDropdownFieldSetting('Sub Category: ', 10, [], null, null, {change:new CallbackObj(this,this.cbSetTranxSubcatg)}, [new WuiButton('btnType', 'Type', btnTypeSetting)]);

	function genFieldElements(fieldSettings) {
		var elements = [];
		
		for (var name in fieldSettings) {
			if (name == 'tranxSubcatg') {
				fieldSettings[name].className = 'subcatgTextField';
				elements.push(new WuiTextField(name, fieldSettings[name]));
				tranxSubcatgDropdownSettings.className = 'subcatgDropdownField';
				elements.push(new WuiDropdownField('tranxSubcatgDropdownField', tranxSubcatgDropdownSettings));
			}
			else
				elements.push(new WuiTextField(name, fieldSettings[name]));
		}
		
		return elements;
	}
	
	var btnOkSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbUpdate)});
	var btnRepeatSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbRepeat)});
	var btnRepeatAutoSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbRepeatAuto)});
	var btnCancelSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbCancel)});
	
	var initElements = {
		tag:'div',className:'expenditureForm',attr:{state:'hide',subcatgMode:'type'},elements:wui.toElements(
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

ExpenditureForm.prototype.show = function() {
	this.htmlElement.setAttribute('state','show');
	this.htmlElement.setAttribute('subcatgMode','type');
	this.htmlElement.className = this.htmlElement.className;
};

ExpenditureForm.prototype.hide = function() {
	this.htmlElement.setAttribute('state','hide');
	this.htmlElement.className = this.htmlElement.className;
};

ExpenditureForm.prototype.edit = function(record, token) {
	this.record = record;
	this.token = token;
	
	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		textField.setValue(wui.format(record[field]));
	}
	
	this.show();
};

ExpenditureForm.prototype.cbUpdate = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
		
		/* focus to negative value */
		if (field == 'amount' && this.record[field] > 0)
			this.record[field] = - Math.abs(this.record[field]);
	}

	if (this.callbackObjs.ok)
		this.callbackObjs.ok.callback(this.record, this.token);
};

ExpenditureForm.prototype.cbCancel = function(w3cEvent) {
	this.hide();
	
	if (this.callbackObjs.cancel)
		this.callbackObjs.cancel.callback(this.record, this.token);
};

ExpenditureForm.prototype.cbRepeat = function(w3cEvent) {
	this.components.frmRepeat.ask();
};

ExpenditureForm.prototype.cbRepeatAuto = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
		
		/* focus to negative value */
		if (field == 'amount' && this.record[field] > 0)
			this.record[field] = - Math.abs(this.record[field]);
	}

	if (this.callbackObjs.saveRepeatAuto)
		this.callbackObjs.saveRepeatAuto.callback(this.record, this.token);
};

ExpenditureForm.prototype.saveRepeat = function(repeatDtl) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
		
		/* focus to negative value */
		if (field == 'amount' && this.record[field] > 0)
			this.record[field] = - Math.abs(this.record[field]);
	}

	if (this.callbackObjs.saveRepeat)
		this.callbackObjs.saveRepeat.callback(this.record, repeatDtl, this.token);
};

ExpenditureForm.prototype.cbSwitchToType = function(w3cEvent) {
	this.htmlElement.setAttribute('subcatgMode','type');
	this.htmlElement.className = this.htmlElement.className;
};

ExpenditureForm.prototype.cbSwitchToSelect = function(w3cEvent) {
	var textField = this.getComponent('tranxSubcatg');
	var dropdownField = this.getComponent('tranxSubcatgDropdownField');
	var subcatgList = this.appData.getTranxSubcatgList('Expenditures');
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

ExpenditureForm.prototype.cbSetTranxSubcatg = function(w3cEvent) {
	var textField = this.getComponent('tranxSubcatg');
	var dropdownField = this.getComponent('tranxSubcatgDropdownField');

	textField.setValue(dropdownField.getValue());
};
