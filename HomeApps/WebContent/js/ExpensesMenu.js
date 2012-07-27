function ExpensesMenu(id, callbackObjs) {
	WuiComponent.call(this, id);
	this.callbackObjs = callbackObjs;
}

ExpensesMenu.prototype = new WuiComponent;

ExpensesMenu.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'menu',elements:wui.toElements(
		{tag:'a',attr:{sectionName:'accountSummary'},text:'Account Summary',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'incomes'},text:'Incomes',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'expenditures'},text:'Expenditures',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'shoppings'},text:'Shoppings',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'investments'},text:'Investments',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'transfers'},text:'Transfers',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'monthlySummary'},text:'Monthly Summary',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'cardSummary'},text:'Card Summary',on:{click:new CallbackObj(this,this.changeSection)}},
		{tag:'a',attr:{sectionName:'assetSummary'},text:'Asset Summary',on:{click:new CallbackObj(this,this.changeSection)}}
		)};
	
	return initElements;
};

ExpensesMenu.prototype.changeSection = function(w3cEvent) {
	var targetSection = w3cEvent.currentTarget.getAttribute('sectionName');
	this.callbackObjs.changeActiveSection.callback(targetSection);
};
