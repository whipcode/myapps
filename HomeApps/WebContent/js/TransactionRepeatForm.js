function TransactionRepeatForm(id, callbackObjs) {
	WuiComponent.call(this,id);

	this.callbackObjs = callbackObjs;
	this.repeatDtl = {
		everyNMonths:0,
		repeatNTimes:0
	};
}

TransactionRepeatForm.prototype = new WuiComponent;

TransactionRepeatForm.prototype.getFieldSettings = function() {
	var fieldSettings = {
		everyNMonths:new WuiTextFieldSetting('Every N Months: ',10, 1),
		repeatNTimes:new WuiTextFieldSetting('Repeat N Times: ',10,1)
	};
	
	return fieldSettings;
};

TransactionRepeatForm.prototype.getElementDef = function() {
	function genFieldElements(fieldSettings) {
		var elements = [];
		
		for (var name in fieldSettings) {
			elements.push(new WuiTextField(name, fieldSettings[name]));
		}
		
		return elements;
	}
	
	var btnOkSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbUpdate)});
	var btnCancelSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbCancel)});
	
	var initElements = {tag:'div',className:'tranxRepeatForm',attr:{state:'hide'},elements:wui.toElements(
			{tag:'div',className:'window',elements:wui.toElements(
				{tag:'div',className:'form',elements:genFieldElements(this.getFieldSettings())},
				{tag:'form',className:'buttons',elements:wui.toElements(
					new WuiButton('btnOk', 'OK', btnOkSetting),
					new WuiButton('btnCancel', 'Cancel', btnCancelSetting)
					)}
				)}
			)};
	
	return initElements;
};

TransactionRepeatForm.prototype.show = function() {
	this.htmlElement.setAttribute('state','show');
	this.htmlElement.className = this.htmlElement.className;
};

TransactionRepeatForm.prototype.hide = function() {
	this.htmlElement.setAttribute('state','hide');
	this.htmlElement.className = this.htmlElement.className;
};

TransactionRepeatForm.prototype.ask = function() {
	var fieldSettings = this.getFieldSettings();
	for (var field in fieldSettings) {
		var textField = this.getComponent(field);
		textField.setValue(fieldSettings[field].initValue);
	}
	
	this.show();
};

TransactionRepeatForm.prototype.cbUpdate = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.repeatDtl[field] = wui.parseString(this.repeatDtl[field], textField.getValue());
	}

	if (this.callbackObjs.ok)
		this.callbackObjs.ok.callback(this.repeatDtl);
};

TransactionRepeatForm.prototype.cbCancel = function(w3cEvent) {
	this.hide();
	
	if (this.callbackObjs.cancel)
		this.callbackObjs.cancel.callback(this.repeatDtl);
};

