var wui = {
	lastError:null,
	sysId:{},
	genId:function(pref) {
		var temp = '0000';
		
		if (!pref) pref = '_';
		if (!this.sysId[pref]) this.sysId[pref] = 0;
		
		temp = temp + (++this.sysId[pref]);
		
		return pref + temp.substr(temp.length-4,4);
	},
	elements:{},
	putElement:function(id, element, override) {
		if (this.elements[id] && !override)
			wui.logError('Duplicated element id: '+id);
		this.elements[id] = element;
		return element;
	},
	getElement:function(id) {
		return this.elements[id];
	},
	removeElement:function(id) {
		this.elements[id] = null;
	},
	logError:function(msg) {
		console.error(msg);
	},
	popUncaughtErrors:function(show) {
		function showErr(msg, url, line) {
			var wuiErrorPopup = document.getElementById('wuiErrorPopup');
			if (!wuiErrorPopup) wuiErrorPopup = document.body.appendChild(document.createElement('div'));
			wuiErrorPopup.setAttribute('style', 'position:fixed;bottom:0;right:0;height:1.5em;padding:0 10px;background:-webkit-linear-gradient(left, rgba(40,52,59,1) 0%,rgba(130,140,149,0.35) 64%,rgba(180,188,199,0) 99%,rgba(181,189,200,0) 100%);border-top-left-radius:5px;z-index:99;text-align:right;color:red;-webkit-transition:height 2s');

			wuiErrorPopup.innerHTML = msg;
		}
		
		if (show) {
			window.onerror = showErr;
		}
		else {
			window.onerror = null;

			var wuiErrorPopup = document.getElementById('wuiErrorPopup');
			if (wuiErrorPopup) wuiErrorPopup.setAttribute('style', 'height:0');
		}
	},
	objUtil:{
		toJson:function(obj) {
			var json = '';
			
			if (typeof obj == 'object') {
				json = '{';
				
				for (var a in obj) {
					switch (typeof obj[a]) {
					case 'object':
						json = json + wui.toJson(obj[a]);
						break;
					case 'string':
						json = json + '\'' + a + '\'' + ':\'' + obj[a] + '\'';
						break;
					case 'number':
						json = json + a + ':' + obj[a];
						break;
					}
				}
				
				json = json + '}';
			}
			else
				json = obj;
			
			return json;
		},
		copyObjValues:function(tgtObj, srcObj, level) {
			if (typeof level != 'number') level = 1;
			
			if (srcObj instanceof Array) {
				if (!tgtObj) tgtObj = []; else tgtObj.splice(0,tgtObj.length);

				for (var i=0; i<srcObj.length; i++) {
					if (typeof srcObj[i] != 'object')
						tgtObj.push(srcObj[i]);
					else if (srcObj[i] instanceof Date)
						tgtObj.push(new Date(srcObj[i].valueOf()));
					else {
						if (level > 1)
							tgtObj.push(this.copyObjValues(null, srcObj[i], level-1));
					}
				}
			}
			else {
				if (!tgtObj) tgtObj = {};

				for (var a in srcObj) {
					if (typeof srcObj[a] != 'object')
						tgtObj[a] = srcObj[a];
					else if (srcObj[a] instanceof Date)
						tgtObj[a] = new Date(srcObj[a].valueOf());
					else {
						if (level > 1)
							tgtObj[a] = this.copyObjValues(null, srcObj[a], level-1);
					}
				}
			}
			return tgtObj;
		},
		mold:function(obj, levels) {
			var crone = obj;
			
			if (levels == 0)
				return null;
			
			if (obj instanceof Array)
				crone = [];
			else
				crone = {};
			
			for (var a in obj) {
				if (typeof obj[a] == 'object' && obj[a]) {
					if (obj[a] instanceof Date)
						crone[a] = obj[a];
					else
						crone[a] = this.mold(obj[a], levels-1);
				}
				else
					crone[a] = obj[a];
			}
			
			return crone;
		}
	},
	dateUtil:{
		monthLabel:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		getToday:function() {
			var date = new Date();
			return new Date(date.getFullYear(), date.getMonth(), date.getDate());
		},
		format:function(date, formatStr) {
			var d = date.getDate();
			var dd = date.getDate(); dd = dd<10?'0'+dd:dd;
			var Mmm = this.monthLabel[date.getMonth()];
			var yyyy = date.getFullYear();
			var HH = date.getHours(); HH = HH<10?'0'+HH:HH;
			var h = date.getHours() % 12 || 12;
			var hh = date.getHours() % 12 || 12; hh = hh<10?'0'+hh:hh;
			var ampm = date.getHours() < 12 ? 'am' : 'pm';
			var mm = date.getMinutes(); mm = mm<10?'0'+mm:mm;
			
			formatStr = formatStr.replace('$(d)',d);
			formatStr = formatStr.replace('$(dd)',dd);
			formatStr = formatStr.replace('$(Mmm)',Mmm);
			formatStr = formatStr.replace('$(yyyy)',yyyy);
			formatStr = formatStr.replace('$(HH)',HH);
			formatStr = formatStr.replace('$(h)',h);
			formatStr = formatStr.replace('$(hh)',hh);
			formatStr = formatStr.replace('$(ampm)',ampm);
			formatStr = formatStr.replace('$(mm)',mm);
			
			return formatStr;
		}
	},
	'':''
};

function WuiElement() {
	this.htmlElement = null;
}

WuiElement.prototype.render = function() {
	/* Override this function in your own class if needed */
};

WuiElement.prototype.refresh = function() {
	/* Override this function in your own class if needed */
};

WuiElement.prototype.setContext = function(htmlId) {
	switch (typeof htmlId) {
	case 'string':
		this.htmlElement = document.getElementById(htmlId);
		if (!this.htmlElement) wui.logError('htmlId not found');
		break;
		
	case 'object':
		if (htmlId instanceof HTMLElement)
			this.htmlElement = htmlId;
		break;
	}
};

WuiElement.prototype.newHtmlElement = function(tag, className, attr, callbacks) {
	this.htmlElement = document.createElement(tag);

	if (className) this.htmlElement.className = className;
	
	if (attr) {
		if (attr.id) this.htmlElement.id = attr.id;
		if (attr.type) this.htmlElement.type = attr.type;
		if (attr.name) this.htmlElement.name = attr.name;
		if (attr.value) this.htmlElement.value = attr.value;
		if (attr.checked) this.htmlElement.checked = attr.checked;
		if (attr.href) this.htmlElement.href = attr.href;
		if (attr.src) this.htmlElement.src = attr.src;
		if (attr.alt) this.htmlElement.alt = attr.alt;
		if (attr.method) this.htmlElement.method = attr.method;
		if (attr.action) this.htmlElement.action = attr.action;
		if (attr.contentEditable) this.htmlElement.contentEditable = attr.contentEditable;
		if (attr.attr) {
			for (var a in attr.attr) {
				this.htmlElement.setAttribute(a, attr.attr[a]);
			}
		}
		if (attr.text) this.addTextNode(attr.text);
		if (attr.userData) this.htmlElement.userData = attr.userData;
	}
	
	if (callbacks) {
		for (var evt in callbacks) {
			this.addEventListener(evt, callbacks[evt]);
		}
	}
	
	return this.htmlElement;
};

WuiElement.prototype.attachRef = function() {
	if (this.htmlElement) this.htmlElement.wuiElement = this;
};

WuiElement.prototype.setClass = function(className) {
	this.htmlElement.className = className;
};

WuiElement.prototype.addClass = function(className) {
	this.htmlElement.classList.add(className);
};

WuiElement.prototype.getAttribute = function(name) {
	return this.htmlElement.getAttribute(name);
};

WuiElement.prototype.setAttribute = function(name, value) {
	this.htmlElement.setAttribute(name, value);
};

WuiElement.prototype.getUserData = function() {
	return this.htmlElement.userData;
};

WuiElement.prototype.setUserData = function(userData) {
	this.htmlElement.userData = userData;
};

WuiElement.prototype.putUserData = function(dataName, value) {
	if (!this.htmlElement.userData) this.htmlElement.userData = {};
	this.htmlElement.userData[dataName] = value;
	return this;
};

WuiElement.prototype.refreshStyle = function() {
	this.htmlElement.className = this.htmlElement.className;
};

WuiElement.prototype.add = function(wuiElementClass, className, attr, callbacks) {
	var newElement = new wuiElementClass(className, attr, callbacks);
	newElement.wuiParent = this;
	this.htmlElement.appendChild(newElement.htmlElement);
	
	if (attr && attr.id) wui.putElement(attr.id, newElement);
	return newElement;
};

WuiElement.prototype.addWuiElement = function(wuiElement) {
	wuiElement.wuiParent = this;
	this.htmlElement.appendChild(wuiElement.htmlElement);

	if (wuiElement.htmlElement.id) wui.putElement(wuiElement.htmlElement.id, wuiElement);
	return wuiElement;
};

WuiElement.prototype.findParent = function(wuiElementClass) {
	if (this.wuiParent) {
		if (this.wuiParent instanceof wuiElementClass)
			return this.wuiParent;
		else
			return this.wuiParent.findParent(wuiElementClass);
	}
	
	return null;
};

WuiElement.prototype.addTextNode = function(text) {
	this.htmlElement.appendChild(document.createTextNode(text));
};

WuiElement.prototype.removeChildElements = function() {
	while (this.htmlElement.childNodes.length > 0) {
		if (this.htmlElement.firstChild.id) wui.removeElement(this.htmlElement.firstChild.id);
		this.htmlElement.removeChild(this.htmlElement.firstChild);
	}
};

WuiElement.prototype.setText = function(text) {
	this.removeChildElements();
	this.addTextNode(text);
};

WuiElement.prototype.getText = function() {
	return this.htmlElement.textContent;
};

WuiElement.prototype.getInnerHtml = function() {
	return this.htmlElement.innerHTML;
};

WuiElement.prototype.addEventListener = function(evt, listener) {
	switch (typeof listener) {
	case 'function':
		this.htmlElement.addEventListener(evt, listener, false);
		break;
	case 'object':
		if (listener.bubble)
			this.htmlElement.addEventListener(evt, listener.bubble, false);
		if (listener.capture)
			this.htmlElement.addEventListener(evt, listener.capture, true);
		break;
	}
};

function WuiText(className, attr, callbacks) {
	if (attr && attr.tag) {
		this.newHtmlElement(attr.tag, className, attr, callbacks);
	}
	else
		this.newHtmlElement('p', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiText.prototype = new WuiElement();

function WuiLink(className, attr, callbacks) {
	this.newHtmlElement('a', className, attr, callbacks);
	return this;
}
WuiLink.prototype = new WuiElement();

function WuiImage(className, attr, callbacks) {
	this.newHtmlElement('img', className, attr, callbacks);
	return this;
}
WuiImage.prototype = new WuiElement();

function WuiList(className, attr, callbacks) {
	if (attr && attr.tag) {
		this.newHtmlElement(attr.tag, className, attr, callbacks);
	}
	else
		this.newHtmlElement('ul', className, attr, callbacks);
	
	if (attr && attr.items) {
		for (var i=0; i<attr.items.length; i++) {
			switch (typeof(attr.items[i])) {
			case 'object':
				this.add(WuiListItem, '', {wuiElement:attr.items[i]});
				break;
			default:
				this.add(WuiListItem, '', {text:attr.items[i]});
			}
		}
	}
	
	return this;
}
WuiList.prototype = new WuiElement();

function WuiListItem(className, attr, callbacks) {
	this.newHtmlElement('li', className, attr, callbacks);
	
	if (attr) {
		if (attr.wuiElement) this.addWuiElement(attr.wuiElement);
	}
	
	return this;
}
WuiListItem.prototype = new WuiElement();

function WuiTable(className, attr, callbacks) {
	this.newHtmlElement('table', className, attr, callbacks);
	
	if (attr) {
		if (attr.header) {
			var header = this.add(WuiTableHeader);
			var row = header.add(WuiTableRow);

			for (var i=0; i<attr.header.length; i++) {
				switch (typeof(attr.header[i])) {
				case 'object':
					row.addWuiElement(attr.header[i]);
					break;
				default:
					row.add(WuiTableCell, '', {text:attr.header[i]});
				}
			}
		}

		if (attr.rows) {
			var body = this.add(WuiTableBody);

			for (var i=0; i<attr.rows.length; i++) {
				var row = body.add(WuiTableRow);
				
				for (var j=0; j<attr.rows[i].length; j++) {
					switch (typeof(attr.rows[i][j])) {
					case 'object':
						row.add(WuiTableCell, '', {wuiElement:attr.rows[i][j]});
						break;
					default:
						row.add(WuiTableCell, '', {text:attr.rows[i][j]});
					}
				}
			}
		}
	}
	
	return this;
}
WuiTable.prototype = new WuiElement();

function WuiTableHeader(className, attr, callbacks) {
	this.newHtmlElement('thead', className, attr, callbacks);
	return this;
}
WuiTableHeader.prototype = new WuiElement();

function WuiTableFooter(className, attr, callbacks) {
	this.newHtmlElement('tfoot', className, attr, callbacks);
	return this;
}
WuiTableFooter.prototype = new WuiElement();

function WuiTableBody(className, attr, callbacks) {
	this.newHtmlElement('tbody', className, attr, callbacks);
	return this;
}
WuiTableBody.prototype = new WuiElement();

function WuiTableRow(className, attr, callbacks) {
	this.newHtmlElement('tr', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiTableRow.prototype = new WuiElement();

function WuiTableHeaderCell(className, attr, callbacks) {
	this.newHtmlElement('th', className, attr, callbacks);
	
	if (attr) {
		if (attr.wuiElement) this.addWuiElement(attr.wuiElement);
	}
	
	return this;
}
WuiTableHeaderCell.prototype = new WuiElement();

function WuiTableCell(className, attr, callbacks) {
	this.newHtmlElement('td', className, attr, callbacks);
	
	if (attr) {
		if (attr.wuiElement) this.addWuiElement(attr.wuiElement);
	}
	
	return this;
}
WuiTableCell.prototype = new WuiElement();

function WuiForm(className, attr, callbacks) {
	this.newHtmlElement('form', className, attr, callbacks);
	
	return this;
}
WuiForm.prototype = new WuiElement();

function WuiFormSubmit(className, attr, callbacks) {
	if (attr) {
		attr.type = 'submit';
		if (attr.text) attr.value = attr.text;
		else attr.value = 'Submit';
	}
	else attr = {type:'submit',value:'Submit'};
	this.newHtmlElement('input', className, attr, callbacks);
	
	return this;
}
WuiFormSubmit.prototype = new WuiElement();

function WuiLabel(className, attr, callbacks) {
	this.newHtmlElement('label', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiLabel.prototype = new WuiElement();

function WuiButton(className, attr, callbacks) {
	this.newHtmlElement('button', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiButton.prototype = new WuiElement();

function WuiTextInput(className, attr, callbacks) {
	if (attr) attr.type = 'text';
	else attr = {type:'text'};
	this.newHtmlElement('input', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiTextInput.prototype = new WuiElement();

WuiTextInput.prototype.getValue = function() {
	return this.htmlElement.value;
};

WuiTextInput.prototype.setValue = function(value) {
	return this.htmlElement.value = value;
};

WuiTextInput.prototype.focus = function() {
	this.htmlElement.focus();
};

WuiTextInput.prototype.enableAutoComplete = function(autoCompleteFn) {
	this.addEventListener('keyup',
		function(evt) {
			var srcElement = evt.srcElement;
			
			if (evt.keyCode < 48) return;
			
			var input = srcElement.value;
			if (input.length > 0) {
				var autoCompleteText = autoCompleteFn(input);
				if (autoCompleteText) {
					srcElement.value = autoCompleteText;
					srcElement.setSelectionRange(input.length, autoCompleteText.length);
				}
			}
		});
};

function WuiPasswordInput(className, attr, callbacks) {
	if (attr) attr.type = 'password';
	else attr = {type:'password'};
	this.newHtmlElement('input', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiPasswordInput.prototype = new WuiElement();

WuiPasswordInput.prototype.getValue = function() {
	return this.htmlElement.value;
};

function WuiTextArea(className, attr, callbacks) {
	this.newHtmlElement('textarea', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiTextArea.prototype = new WuiElement();

WuiTextArea.prototype.getValue = function() {
	return this.htmlElement.value;
};

WuiTextArea.prototype.setValue = function(text) {
	return this.htmlElement.value = text;
};

function WuiCheckbox(className, attr, callbacks) {
	if (attr) attr.type = 'checkbox';
	else attr = {type:'checkbox'};
	this.newHtmlElement('input', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiCheckbox.prototype = new WuiElement();

WuiCheckbox.prototype.getValue = function() {
	return this.htmlElement.checked;
};

WuiCheckbox.prototype.setValue = function(checked) {
	this.htmlElement.checked = checked;
};

function WuiRadioButton(className, attr, callbacks) {
	if (attr) attr.type = 'radio';
	else attr = {type:'radio'};
	this.newHtmlElement('input', className, attr, callbacks);
	
	if (attr) {
	}
	
	return this;
}
WuiRadioButton.prototype = new WuiElement();

WuiRadioButton.prototype.getValue = function() {
	return this.htmlElement.checked;
};

WuiRadioButton.prototype.setValue = function(checked) {
	this.htmlElement.checked = checked;
};

function WuiSelection(className, attr, callbacks) {
	this.newHtmlElement('select', className, attr, callbacks);
	this.options = [];
	
	if (attr) {
		if (attr.options) {
			for (var i=0; i<attr.options.length; i++) {
				this.options.push(this.add(WuiOption, '', {text:attr.options[i]}));
			}
		}
	}
	
	return this;
}
WuiSelection.prototype = new WuiElement();

WuiSelection.prototype.clearOptions = function() {
	this.removeChildElements();
	this.options = [];
};

WuiSelection.prototype.addOption = function(className, attr, callbacks) {
	var option = this.add(WuiOption, className, attr, callbacks);
	this.options.push(option);
	return option;
};

WuiSelection.prototype.getSelectedIdx = function() {
	return this.htmlElement.selectedIndex;
};

WuiSelection.prototype.getSelectedValue = function() {
	return this.htmlElement.value;
};

WuiSelection.prototype.getSelectedOption = function() {
	return this.options[this.getSelectedIdx()];
};

WuiSelection.prototype.setSelectedIdx = function(idx) {
	this.htmlElement.selectedIndex = idx;
};

function WuiOption(className, attr, callbacks) {
	this.newHtmlElement('option', className, attr, callbacks);
	return this;
}
WuiOption.prototype = new WuiElement();

function WuiWrapper(className, attr, callbacks) {
	this.newHtmlElement('div', className, attr, callbacks);
	return this;
}
WuiWrapper.prototype = new WuiElement();

function WuiTextField(className, attr, callbacks) {
	this.newHtmlElement('div', className||'WuiTextField', attr, callbacks);
	
	if (attr && attr.label) this.add(WuiLabel, '', {text:attr.label});
	this.textInput = this.add(WuiTextInput, 'Text', attr);
	
	return this;
}
WuiTextField.prototype = new WuiElement();

WuiTextField.prototype.getValue = function() {
	return this.textInput.getValue();
};

WuiTextField.prototype.setValue = function(value) {
	return this.textInput.setValue(value);
};

WuiTextField.prototype.focus = function() {
	this.textInput.focus();
};

WuiTextField.prototype.enableAutoComplete = function(autoCompleteFn) {
	return this.textInput.enableAutoComplete(autoCompleteFn);
};

function WuiPasswordField(className, attr, callbacks) {
	this.newHtmlElement('div', className||'WuiPasswordField', attr, callbacks);
	
	if (attr && attr.label) this.add(WuiLabel, '', {text:attr.label});
	this.textInput = this.add(WuiPasswordInput, 'Text', attr);
	
	return this;
}
WuiPasswordField.prototype = new WuiElement();

WuiPasswordField.prototype.getValue = function() {
	return this.textInput.getValue();
};

function WuiTextAreaField(className, attr, callbacks) {
	this.newHtmlElement('div', className||'WuiTextAreaField', attr, callbacks);
	
	if (attr && attr.label) this.add(WuiLabel, '', {text:attr.label});
	this.textInput = this.add(WuiTextArea, 'Text', attr);
	
	return this;
}
WuiTextAreaField.prototype = new WuiElement();

WuiTextAreaField.prototype.getValue = function() {
	return this.textInput.getValue();
};

WuiTextAreaField.prototype.setValue = function(text) {
	this.textInput.setValue(text);
};

function WuiCheckboxField(className, attr, callbacks) {
	this.newHtmlElement('div', className||'WuiCheckboxField');
	
	if (attr && attr.label) this.add(WuiLabel, '', {text:attr.label});
	if (attr && attr.frontlabel) this.add(WuiLabel, '', {text:attr.frontlabel});
	
	var checkboxAttr = wui.objUtil.copyObjValues({}, attr);
	if (checkboxAttr.id) checkboxAttr.id = null;
	this.checkbox = this.add(WuiCheckbox, 'Checkbox', checkboxAttr, callbacks);
	if (attr && attr.rearlabel) this.add(WuiLabel, '', {text:attr.rearlabel});
	
	return this;
}
WuiCheckboxField.prototype = new WuiElement();

WuiCheckboxField.prototype.getValue = function() {
	return this.checkbox.getValue();
};

WuiCheckboxField.prototype.setValue = function(checked) {
	this.checkbox.setValue(checked);
};

function WuiSelectionField(className, attr, callbacks) {
	this.newHtmlElement('div', className||'WuiSelectionField', attr);
	
	if (attr && attr.label) this.add(WuiLabel, '', {text:attr.label});
	this.options = this.add(WuiSelection, 'Options', attr, callbacks);
	
	return this;
}
WuiSelectionField.prototype = new WuiElement();

WuiSelectionField.prototype.clearOptions = function() {
	return this.options.clearOptions();
};

WuiSelectionField.prototype.addOption = function(className, attr, callbacks) {
	return this.options.addOption(className, attr, callbacks);
};

WuiSelectionField.prototype.getSelectedIdx = function() {
	return this.options.getSelectedIdx();
};

WuiSelectionField.prototype.getSelectedValue = function() {
	return this.options.getSelectedValue();
};

WuiSelectionField.prototype.getSelectedOption = function() {
	return this.options.getSelectedOption();
};

WuiSelectionField.prototype.setSelectedIdx = function(idx) {
	return this.options.setSelectedIdx(idx);
};

function WuiCustomField(className, attr, callbacks) {
	this.newHtmlElement('div', className||'WuiCustomField', attr, callbacks);
	
	if (attr && attr.label) this.add(WuiLabel, '', {text:attr.label});
	/* Use xx.add to add more elements in your code */
	
	return this;
}
WuiCustomField.prototype = new WuiElement();
