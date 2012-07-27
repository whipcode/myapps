function Application(htmlId) {
	this.setContext(htmlId);
	
	this.add(WuiText, '', {text:'Jobfile Main',tag:'h1'});
}
Application.prototype = new WuiElement();

