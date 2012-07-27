function ExpensesApp(id) {
	WuiComponent.call(this, id);

	this.contextRoot = '';
	this.appData = new ExpensesData();
	
	this.components = {
		menu:new ExpensesMenu('menu',{changeActiveSection:new CallbackObj(this, this.setActiveSection)}),
		filters:new ExpensesFilters('filters',{refreshSections:new CallbackObj(this, this.refreshSections),saveToExcel:new CallbackObj(this,this.saveToExcel),newTran:new CallbackObj(this,this.newTran)}, this.appData),
		sections:new ExpensesAppSections('sections', this.appData),
		ajaxWindow:null
	};
}

ExpensesApp.prototype = new WuiComponent;

ExpensesApp.prototype.setContextRoot = function(contextRoot) {
	this.contextRoot = contextRoot;
};

ExpensesApp.prototype.getElementDef = function() {
	var elementDef = {tag:'div',className:'expensesApp',attr:{activeSection:'accountSummary'},elements:wui.toElements(
		this.components.menu,
		this.components.filters,
		this.components.sections
		)};
	
	return elementDef;
};

ExpensesApp.prototype.init = function(container) {
	/* Init Html Elements */
	this.createHtmlElement(container);
};

ExpensesApp.prototype.setActiveSection = function(sectionName) {
	this.htmlElement.setAttribute('activeSection',sectionName);
	this.htmlElement.className = this.htmlElement.className;
};

ExpensesApp.prototype.getActiveSection = function() {
	return this.htmlElement.getAttribute('activeSection');
};

ExpensesApp.prototype.refreshSections = function() {
	this.components.sections.refresh();
};

ExpensesApp.prototype.saveToExcel = function() {
	var filename = 'transaction-'+this.appData.getSelectedAccount().id+'-'+ this.appData.getSelectedYear()+'-'+ (this.appData.getSelectedMonth()+1)+'.xls';
	var url = this.contextRoot + '/xls/'+filename;
	var iframe = document.createElement('iframe');
	iframe.src = url;
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
};

ExpensesApp.prototype.newTran = function() {
	this.components.sections.newTran(this.getActiveSection());
};

ExpensesApp.prototype.dataLoaded = function() {
	this.components.filters.refresh();
	this.components.sections.refresh();
};

ExpensesApp.prototype.run = function() {
	this.appData.load(new CallbackObj(this, this.dataLoaded));
};

