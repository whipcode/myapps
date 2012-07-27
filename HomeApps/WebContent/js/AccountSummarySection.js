function AccountSummarySection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;
}

AccountSummarySection.prototype = new WuiComponent;

AccountSummarySection.prototype.getElementDef = function() {
	var _ = {tag:'td'};
	var elementDef = {tag:'div',className:'accountSummary',elements:wui.toElements(
		{tag:'table',id:'summaryTable',className:'summaryTable',elements:wui.toElements(
			{tag:'thead',elements:wui.toElements(
				{tag:'tr',elements:wui.toElements(
					{tag:'th'},
					{tag:'th',text:'JAN'},
					{tag:'th',text:'FEB'},
					{tag:'th',text:'MAR'},
					{tag:'th',text:'APR'},
					{tag:'th',text:'MAY'},
					{tag:'th',text:'JUN'},
					{tag:'th',text:'JUL'},
					{tag:'th',text:'AUG'},
					{tag:'th',text:'SEP'},
					{tag:'th',text:'OCT'},
					{tag:'th',text:'NOV'},
					{tag:'th',text:'DEC'}
					)}
				)},
			{tag:'tbody',id:'body'}
			)},
		{tag:'div',elements:wui.toElements(
			new WuiButton('newAcc','New Account')
			)}
		)};
	
	return elementDef;
};

AccountSummarySection.prototype.getSummaryTableBody = function() {
	return this.getHtmlElement('summaryTable.body');
};

AccountSummarySection.prototype.refresh = function() {
	var summaryTableBody = this.getSummaryTableBody();
	var summaryTable = this.appData.getAccountSummary(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), 12);
	var _ = {tag:'td'};
	var elements = [];
	
	/* Set Opening */
	var tr = {tag:'tr',className:'opening'};
	tr.elements = [];
	tr.elements.push({tag:'th',text:'Opening'});
	for (var m=0; m<12; m++) {
		tr.elements.push({tag:'td',elements:[{tag:'input',type:'text',value:wui.format(summaryTable.opening[m]),on:{change:new CallbackObj(this,this.updateOpening)},userData:{monthlyBalance:summaryTable.monthlyBalances[m]?summaryTable.monthlyBalances[m].opening:null,monthIdx:m}}]});
	}
	elements.push(tr);
	
	/* Set Expenses */
	for (var catg in summaryTable.transactions) {
		var tr = {tag:'tr',className:'expenseGrp'};
		tr.elements = [{tag:'th',text:catg}];
		for (var m=0; m<12;m++) {
			var subttl = 0;
			for (var t in summaryTable.transactions[catg])
				if (summaryTable.transactions[catg][t][m]) subttl += summaryTable.transactions[catg][t][m];
			if (subttl != 0)
				tr.elements.push({tag:'td',text:wui.format(subttl)});
			else
				tr.elements.push(_);
		}
		elements.push(tr);
		
		for (var subcatg in summaryTable.transactions[catg]) {
			var tr = {tag:'tr',className:'expenseDtl'};
			tr.elements = [];
			tr.elements.push({tag:'th',text:subcatg});
			for (var m=0; m<12; m++) {
				tr.elements.push({tag:'td',className:(summaryTable.transactions[catg][subcatg][m]<0?'neg':''),text:wui.format(summaryTable.transactions[catg][subcatg][m])});
			}
			elements.push(tr);
		}
	}
	
	/* Set Budgets */
	var tr = {tag:'tr',className:'budgets'};
	tr.elements = [];
	tr.elements.push({tag:'th',text:'Budgets'});
	for (var m=0; m<12; m++) {
		tr.elements.push({tag:'td'});
	}
	elements.push(tr);

	/* Set Closing */
	var tr = {tag:'tr',className:'closing'};
	tr.elements = [];
	tr.elements.push({tag:'th',text:'Closing'});
	for (var m=0; m<12; m++) {
		tr.elements.push({tag:'td',elements:[{tag:'input',type:'text',value:wui.format(summaryTable.closing[m]),on:{change:new CallbackObj(this,this.updateClosing)},userData:{monthlyBalance:summaryTable.monthlyBalances[m]?summaryTable.monthlyBalances[m].closing:null,monthIdx:m}}]});
	}
	elements.push(tr);
	
	/* Set Difference */
	var tr = {tag:'tr',className:'difference'};
	tr.elements = [];
	tr.elements.push({tag:'th',text:'?'});
	for (var m=0; m<12; m++) {
		tr.elements.push({tag:'td',className:(summaryTable.difference[m]<0?'neg':''),text:wui.format(summaryTable.difference[m])});
	}
	elements.push(tr);
	
	/* Update Container */
	wui.clearChildElements(summaryTableBody);
	wui.createHtmlElements(elements, summaryTableBody);
};

AccountSummarySection.prototype.updateOpening = function(w3cEvent) {
	if (!this.isUpdatingOpening) {
		this.isUpdatingOpening = true;
		var textbox = w3cEvent.currentTarget;
		if (textbox.userData.monthlyBalance) {
			if (textbox.value != '')
				textbox.userData.monthlyBalance.amount = wui.parseString(textbox.userData.monthlyBalance.amount,textbox.value);
			else
				textbox.userData.monthlyBalance.deleteMark = true;
			this.appData.updateMonthlyBalance(textbox.userData.monthlyBalance);
		}
		else {
			var newMonthlyBalance = this.appData.newMonthlyBalance(this.appData.getSelectedAccountIdx(), new Date(this.appData.getSelectedYear(), textbox.userData.monthIdx, 1), 'O', wui.parseString(0, textbox.value));
			this.appData.addMonthlyBalance(newMonthlyBalance);
		}
		this.refresh();
		this.isUpdatingOpening = false;
	}
};

AccountSummarySection.prototype.updateClosing = function(w3cEvent) {
	if (!this.isUpdatingClosing) {
		this.isUpdatingClosing = true;
		var textbox = w3cEvent.currentTarget;
		if (textbox.userData.monthlyBalance) {
			if (textbox.value != '')
				textbox.userData.monthlyBalance.amount = wui.parseString(textbox.userData.monthlyBalance.amount,textbox.value);
			else
				textbox.userData.monthlyBalance.deleteMark = true;
			this.appData.updateMonthlyBalance(textbox.userData.monthlyBalance);
		}
		else {
			var newMonthlyBalance = this.appData.newMonthlyBalance(this.appData.getSelectedAccountIdx(), new Date(this.appData.getSelectedYear(), textbox.userData.monthIdx, 1), 'C', wui.parseString(0, textbox.value));
			this.appData.addMonthlyBalance(newMonthlyBalance);
		}
		this.refresh();
		this.isUpdatingClosing = false;
	}
};

AccountSummarySection.prototype.saveAccount = function(w3cEvent) {
	this.data.saveAccount();
};