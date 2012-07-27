function Application(htmlId) {
	this.setContext(htmlId);
	
	var viewport = this.add(WuiWrapper, 'viewport');
	viewport.add(JobFileMenu, 'jobfileMenu');
	viewport.add(JobFileEnquiry, 'jobfileEnquiry');
}
Application.prototype = new WuiElement();

function JobFileMenu(id, attr, callbacks) {
	this.newHtmlElement(id, 'div', '', attr, callbacks);
	
	this.add(WuiText, '', {text:'Job File',tag:'h1'});
	this.add(WuiLink, '', {href:'#',text:'File'});
	this.add(WuiLink, '', {href:'#',text:'View'});
	this.add(WuiLink, '', {href:'#',text:'Tools'});
	this.add(WuiLink, '', {href:'#',text:'Window'});
	this.add(WuiLink, '', {href:'#',text:'Help'});
	
	return this;
}
JobFileMenu.prototype = new WuiElement();

function JobFileEnquiry(id, attr, callbacks) {
	this.newHtmlElement(id, 'div', '', attr, callbacks);
	
	this.add(WuiText, '', {text:'Job File',tag:'h1'});
	this.add(WuiLink, '', {href:'#',text:'File'});
	this.add(WuiLink, '', {href:'#',text:'View'});
	this.add(WuiLink, '', {href:'#',text:'Tools'});
	this.add(WuiLink, '', {href:'#',text:'Window'});
	this.add(WuiLink, '', {href:'#',text:'Help'});
	
	return this;
}
JobFileEnquiry.prototype = new WuiElement();