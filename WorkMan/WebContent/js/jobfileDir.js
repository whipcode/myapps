function Application(htmlId) {
	this.setContext(htmlId);
	
	var viewport = this.add(WuiWrapper, '', {className:'AppViewPort'});
	
	viewport.add(WuiText, 'title', {text:'JobFile Directory',tag:'h1'});
	viewport.add(JobFileList, 'jobFileList');
	
	viewport.add(Menu, 'menuDiv');
	
	/* Popups */
	this.add(NewJobFileForm, 'newJobFileForm');
	
	/* Load data */
	dwr.engine.setAsync(false);
}
Application.prototype = new WuiElement();

function JobFileList(id, attr, callbacks) {
	this.newHtmlElement(id, 'ul');
	
	var newItem = this.add(WuiListItem);
	newItem.add(WuiLink, 'createJobFileLink', {href:'#', text:'<Create New>'}, {click:showNewJobFileForm});

	return this;
}
JobFileList.prototype = new WuiElement();

function Menu(id, attr, callbacks) {
	this.newHtmlElement(id, 'div');
	
	this.add(WuiLink, '', {href:'#', text:'Organize'});

	return this;
}
Menu.prototype = new WuiElement();

function NewJobFileForm(id, attr, callbacks) {
	this.newHtmlElement(id, 'div', 'Popup');

	var fields = this.add(WuiWrapper);
	
	fields.add(WuiText,'', {text:'New JobFile', tag:'h1'});
	fields.add(WuiTextField, 'new.filename', {label:'Job File Name'});
	fields.add(WuiTextField, 'new.status', {label:'Status'});
	fields.add(WuiTextField, 'new.startDate', {label:'Start Date'});
	fields.add(WuiTextField, 'new.endDate', {label:'End Date'});
	fields.add(WuiTextField, 'new.remarks', {label:'Remarks'});
	
	var buttons = fields.add(WuiWrapper, '', {className:'ButtonsDiv'});
	buttons.add(WuiButton, 'btnCreateJobFile', {text:'Create'}, {click:createNewJobFile});
	buttons.add(WuiButton, 'btnCancelJobFile', {text:'Cancel'}, {click:cancelNewJobFile});

	return this;
}
NewJobFileForm.prototype = new WuiElement();

NewJobFileForm.prototype.show = function() {
	this.setAttribute('show','yes');
	this.refreshStyle();
};

NewJobFileForm.prototype.hide = function() {
	this.setAttribute('show','no');
	this.refreshStyle();
};

NewJobFileForm.prototype.getValues = function(dataObj) {
	dataObj.filename = wui.getElement('new.filename').getValue();
	dataObj.status = wui.getElement('new.status').getValue();
//	dataObj.startDate = wui.getElement('new.startDate').getValue();
//	dataObj.endDate = wui.getElement('new.endDate').getValue();
	dataObj.remarks = wui.getElement('new.remarks').getValue();
	
	return dataObj;
};
	
function showNewJobFileForm(evt) {
	wui.getElement('newJobFileForm').show();
	evt.preventDefault();
}

function createNewJobFile(evt) {
	var newJobFileForm = wui.getElement('newJobFileForm');
	var newJobFile = newJobFileForm.getValues({});
	
	JobFileDao.createJobFile(newJobFile);
	
	wui.getElement('newJobFileForm').hide();
	evt.preventDefault();
}

function cancelNewJobFile(evt) {
	wui.getElement('newJobFileForm').hide();
	evt.preventDefault();
}