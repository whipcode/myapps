function TransferForm(id, callbackObjs) {
	WuiComponent.call(this,id);

	this.record = null;
	this.callbackObjs = callbackObjs;
	this.token = null;
}

TransferForm.prototype = new WuiComponent;

TransferForm.prototype.getFieldSettings = function() {
	var appData = this.appData;
	
	function autoComplete(evt) {
		var htmlElement = evt.currentTarget;
		var subcatgList = appData.getTranxSubcatgList('Transfers');
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
	
	var fieldSettings = {
		bankDate:new WuiTextFieldSetting('Transfer Date: ',10),
		amount:new WuiTextFieldSetting('Amount: ',10),
		desc:new WuiTextFieldSetting('Description: ',10),
		tranxSubcatg:new WuiTextFieldSetting('Sub Category: ',10, null, null, {keyup:autoComplete}),
		remarks:new WuiTextFieldSetting('Remarks: ',10)
	};
	
	return fieldSettings;
};

TransferForm.prototype.getElementDef = function() {
	function genFieldElements(fieldSettings) {
		var elements = [];
		
		for (var name in fieldSettings) {
			elements.push(new WuiTextField(name, fieldSettings[name]));
		}
		
		return elements;
	}
	
	var initElements = {tag:'div',className:'transferForm',attr:{state:'hide'},elements:wui.toElements(
			{tag:'div',className:'window',elements:wui.toElements(
				{tag:'div',className:'editForm',elements:genFieldElements(this.getFieldSettings())},
				{tag:'div',className:'buttons',elements:wui.toElements(
					{tag:'button',text:'OK',on:{click:new CallbackObj(this,this.updateData)}},
					{tag:'button',text:'Cancel',text:'Cancel',on:{click:new CallbackObj(this,this.cancel)}}
					)}
				)}
			)};
	
	return initElements;
};

TransferForm.prototype.show = function() {
	this.htmlElement.setAttribute('state','show');
	this.htmlElement.className = this.htmlElement.className;
};

TransferForm.prototype.hide = function() {
	this.htmlElement.setAttribute('state','hide');
	this.htmlElement.className = this.htmlElement.className;
};

TransferForm.prototype.edit = function(record, token) {
	this.record = record;
	this.token = token;
	
	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		textField.setValue(wui.format(record[field]));
	}
	
	this.show();
};

TransferForm.prototype.updateData = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		this.record[field] = wui.parseString(this.record[field], textField.getValue());
	}

	if (this.callbackObjs.ok)
		this.callbackObjs.ok.callback(this.record, this.token);
};

TransferForm.prototype.cancel = function(w3cEvent) {
	this.hide();
	
	if (this.callbackObjs.cancel)
		this.callbackObjs.cancel.callback(this.record, this.token);
};