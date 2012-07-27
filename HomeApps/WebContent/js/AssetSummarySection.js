function AssetSummarySection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;

	var assetFormCallbackObjs = {
		ok:new CallbackObj(this,this.cbRefresh),
		cancel:null
	};

	this.components = {
		assetForm:new AssetForm('assetForm', assetFormCallbackObjs, appData)
	};
}

AssetSummarySection.prototype = new WuiComponent();

AssetSummarySection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'AssetSummary',elements:wui.toElements(
		{tag:'table',id:'assetSummaryTable',className:'AssetSummaryTable'},
		this.components.assetForm
		)};
	
	return initElements;
};

AssetSummarySection.prototype.refresh = function() {
	var assetSummary = this.appData.getAssetSummary(this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	var elements = [];
	var _this = this;
	
	var btnNewSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbNew)});
	
	var thead = {tag:'thead',elements:[]};
	if (thead) {
		var tr = {tag:'tr',elements:[]};
		if (tr) {
			tr.elements.push({tag:'th',elements:wui.toElements(new WuiButton('btnNew', 'New', btnNewSetting))});
			for (var owner in assetSummary.owners) {
				tr.elements.push({tag:'td',text:owner});
			}
			tr.elements.push({tag:'td'});	/* dummy space */
			thead.elements.push(tr);
		}
		elements.push(thead);
	}
	
	var tbody = {tag:'tbody',elements:[]};
	if (tbody) {
		for (var category in assetSummary.assetEntries) {
			var assetEntries = assetSummary.assetEntries[category];
			
			var tr = {tag:'tr',className:'Category',elements:[{tag:'th',text:category}]};
			if (tr) {
				for (var owner in assetSummary.owners)
					tr.elements.push({tag:'td'});
				tr.elements.push({tag:'td'});	/* dummy space column */
				tbody.elements.push(tr);
			}
			
			for (var i in assetEntries) {
				var assetEntry = assetEntries[i];
				
				var tr = {tag:'tr',className:'Asset',elements:[{tag:'th',text:assetEntry['Home'].asset.name, userData:{assetEntry:assetEntry},on:{
					click:function(evt) {
						var asset = evt.srcElement.userData.assetEntry['Home'].asset;
						if (asset.id > 0)
							_this.components.assetForm.edit(asset, {mode:'edit'});
					}
				}}]};
				if (tr) {
					for (var owner in assetEntry) {
						var assetValue = assetEntry[owner];
						
						var td = {tag:'td',text:wui.format(assetValue.value||''),attr:{contentEditable:assetValue.asset.id?'true':'false'},userData:{assetValue:assetValue}, on:{
							focus:function(evt) {
								var srcElement = evt.srcElement;
								srcElement.textContent = srcElement.userData.assetValue.valueStr;
								srcElement.setAttribute('b4valueStr',srcElement.userData.assetValue.valueStr);
							},
							blur:function(evt) {
								var srcElement = evt.srcElement;
								srcElement.userData.assetValue.valueStr = srcElement.textContent;
								if (srcElement.userData.assetValue.valueStr.length > 0)
									srcElement.userData.assetValue.value = eval(srcElement.userData.assetValue.valueStr);
								else
									srcElement.userData.assetValue.value = 0;
								
								srcElement.textContent = wui.format(srcElement.userData.assetValue.value||'');
									
								if (srcElement.getAttribute('b4valueStr') != srcElement.userData.assetValue.valueStr) {
									_this.appData.saveAssetValue(srcElement.userData.assetValue);
									_this.updateTotal();
								}
							},
							keypress:function(evt) {
								switch (evt.keyCode) {
								case 13:
									evt.srcElement.blur();
								}
							}
						}};
						if (td)
							tr.elements.push(td);
					}
					tr.elements.push({tag:'td'});	/* grand total column */
					tr.elements.push({tag:'td'});	/* dummy space column */
					tbody.elements.push(tr);
				}
			}
		}
		elements.push(tbody);
	}
	
	var tfoot = {tag:'tfoot',id:'tfoot',elements:[]};
	if (tfoot) {
		var grandTotal = 0;
		var tr = {tag:'tr',className:'Total',elements:[{tag:'th',text:'Total'}]};
		if (tr) {
			for (var owner in assetSummary.owners) {
				var td = {tag:'td',text:wui.format(assetSummary.owners[owner].value)};
				if (td)
					tr.elements.push(td);

				grandTotal += assetSummary.owners[owner].value;
			}
			tr.elements.push({tag:'td'});	/* dummy space column */
			
			tfoot.elements.push(tr);
		}
		
		elements.push(tfoot);
	}
	
	var assetSummaryTable = this.getHtmlElement('assetSummaryTable');
	wui.clearChildElements(assetSummaryTable);
	wui.createHtmlElements(elements, assetSummaryTable);
};

AssetSummarySection.prototype.updateTotal = function() {
	var assetSummary = this.appData.getAssetSummary(this.appData.getSelectedYear(), this.appData.getSelectedMonth());
	var elements = [];

	var tr = {tag:'tr',className:'Total',elements:[{tag:'th',text:'Total'}]};
	if (tr) {
		for (var owner in assetSummary.owners) {
			var td = {tag:'td',text:wui.format(assetSummary.owners[owner].value)};
			if (td)
				tr.elements.push(td);
		}
		tr.elements.push({tag:'td'});	/* dummy space column */
		
		elements.push(tr);
	}
		
	
	var assetSummaryTableFoot = this.getHtmlElement('assetSummaryTable.tfoot');
	wui.clearChildElements(assetSummaryTableFoot);
	wui.createHtmlElements(elements, assetSummaryTableFoot);
};

AssetSummarySection.prototype.cbNew = function(evt) {
	var asset = new Asset();
	this.components.assetForm.edit(asset, {mode:'new'});
};

AssetSummarySection.prototype.cbRefresh = function(evt) {
	this.refresh();
};

function AssetForm(id, callbackObjs, appData) {
	WuiComponent.call(this,id);

	this.record = null;
	this.callbackObjs = callbackObjs;
	this.appData = appData;
}

AssetForm.prototype = new WuiComponent;

AssetForm.prototype.getFieldSettings = function() {
	var fieldSettings = {
		name:new WuiTextFieldSetting('Asset Name: ',10),
		category:new WuiTextFieldSetting('Category: ',10),
		discontinued:new WuiCheckboxFieldSetting('Discontinue? ',10),
		deleteMark:new WuiCheckboxFieldSetting('Delete? ',10)
	};
	
	return fieldSettings;
};

AssetForm.prototype.getElementDef = function() {
	var btnTypeSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbSwitchToType)});

	function genFieldElements(fieldSettings) {
		var elements = [];
		
		for (var name in fieldSettings) {
			if (fieldSettings[name] instanceof WuiTextFieldSetting)
				elements.push(new WuiTextField(name, fieldSettings[name]));
			else if (fieldSettings[name] instanceof WuiCheckboxFieldSetting)
				elements.push(new WuiCheckboxField(name, fieldSettings[name]));
		}
		
		return elements;
	}
	
	var btnOkSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbUpdate)});
	var btnCancelSetting = new WuiButtonSetting({click:new CallbackObj(this,this.cbCancel)});
	
	var initElements = {
		tag:'div',className:'AssetForm',attr:{state:'hide'},elements:wui.toElements(
			{tag:'div',className:'window',elements:wui.toElements(
				{tag:'div',className:'EditForm',elements:genFieldElements(this.getFieldSettings())},
				{tag:'div',className:'Buttons',elements:wui.toElements(
					new WuiButton('btnOk', 'Save', btnOkSetting),
					new WuiButton('btnCancel', 'Cancel', btnCancelSetting)
					)}
				)}
		)};
	
	return initElements;
};

AssetForm.prototype.show = function() {
	this.htmlElement.setAttribute('state','show');
	this.htmlElement.className = this.htmlElement.className;
};

AssetForm.prototype.hide = function() {
	this.htmlElement.setAttribute('state','hide');
	this.htmlElement.className = this.htmlElement.className;
};

AssetForm.prototype.edit = function(record, token) {
	this.record = record;
	this.token = token;
	
	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		if (textField instanceof WuiTextField)
			textField.setValue(wui.format(record[field]));
		else if (textField instanceof WuiCheckboxField)
			textField.setValue(record[field]);
	}
	
	this.show();
};

AssetForm.prototype.cbUpdate = function(w3cEvent) {
	this.hide();

	for (var field in this.getFieldSettings()) {
		var textField = this.getComponent(field);
		if (textField instanceof WuiTextField)
			this.record[field] = wui.parseString(this.record[field], textField.getValue());
		else if (textField instanceof WuiCheckboxField)
			this.record[field] = textField.getValue();
	}

	this.appData.saveAsset(this.record);

	if (this.callbackObjs.ok)
		this.callbackObjs.ok.callback(this.record, this.token);
};

AssetForm.prototype.cbCancel = function(w3cEvent) {
	this.hide();
	
	if (this.callbackObjs.cancel)
		this.callbackObjs.cancel.callback(this.record, this.token);
};

