var uif = {
	version:'beta',
	widgets:{},

	setElementFunctions:function(element) {
		if (element.elements == null)
			element.elements = new Object();
		
		element.createAppendElement = this.efCreateAppendElement;
		element.createElement = this.efCreateElement;
		element.getAttr = this.efGetAttr;
		element.setAttr = this.efSetAttr;
		element.setHref = this.efSetHref;
		element.setText = this.efSetText;
		element.attachToElement = this.efAttachToElement;
		return element;
	},
	
	getElementById:function(id) {
		var element = document.getElementById(id);
		
		if (element) uif.setElementFunctions(element);
		
		return element;
	},
	
	createElement:function(tag,id,clss) {
		var element;
		
		element = document.createElement(tag);
		if (id!='' && id != null) element.setAttribute('id', id);
		if (clss!='' && clss != null) element.setAttribute('class', clss);
		uif.setElementFunctions(element);
		
		return element;
	},

	efCreateAppendElement:function(tag,id,clss) {
		var childElement;

		if (id != '' && id != null) {
			if (this.getAttribute('id') != null) 
				childElement = uif.createElement(tag,this.getAttribute('id')+'_'+id,clss);
			else
				childElement = uif.createElement(tag,id,clss);
		}
		else
			childElement = uif.createElement(tag,id,clss);
		this.appendChild(childElement);
		
		if (id != '' && id != null)
			this[id] = childElement;
		else
			this[tag] = childElement;
		
		return this;
	},

	efCreateElement:function(tag,id,clss) {
		var childElement;

		if (id != '' && id != null) {
			if (this.getAttribute('id') != null) 
				childElement = uif.createElement(tag,this.getAttribute('id')+'_'+id,clss);
			else
				childElement = uif.createElement(tag,id,clss);
		}
		else
			childElement = uif.createElement(tag,id,clss);
		this.appendChild(childElement);
		
		if (id != '' && id != null)
			this[id] = childElement;
		else
			this[tag] = childElement;
		
		return childElement;
	},
	
	efGetAttr:function(name) {
		return this.getAttribute(name);
	},
	
	efSetAttr:function(name,value) {
		this.setAttribute(name,value);
		
		return this;
	},
	
	efSetHref:function(href) {
		this.setAttribute('href',href);
		
		return this;
	},
	
	efSetText:function(text) {
		var textNode = document.createTextNode(text);
		
		while (this.childNodes.length>0) {
			this.removeChild(this.firstChild);
		}

		this.appendChild(textNode);
		
		return this;
	},
	
	efAttachToElement:function(element) {
		element.appendChild(this);
	},
	
	toSysDateStr:function(date) {
		return (date.getFullYear()*100+date.getMonth()+1)*100+date.getDate();
	}
	
};
