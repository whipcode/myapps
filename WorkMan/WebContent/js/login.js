function Application(htmlId) {
	this.setContext(htmlId);
	
	var form = this.add(WuiForm,'',{method:'POST',action:'j_security_check'});
	form.add(WuiText, '', {text:'Login',tag:'h1'});
	form.add(WuiTextField, '', {label:'ID',name:'j_username'}).focus();
	form.add(WuiPasswordField, '', {label:'Password',name:'j_password'});
	
	var buttons = form.add(WuiWrapper,'',{id:'buttonGroup'});
	buttons.add(WuiFormSubmit, '', {id:'btnLogin', text:'Login'});
}
Application.prototype = new WuiElement();

