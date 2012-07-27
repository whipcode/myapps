function CardSummarySection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;
}

CardSummarySection.prototype = new WuiComponent;

CardSummarySection.prototype.getElementDef = function() {
	var _ = {tag:'td'};
	var elementDef = {tag:'div',className:'cardSummary',elements:wui.toElements(
		{tag:'table',id:'summaryTable',className:'summaryTable',elements:wui.toElements(
			{tag:'thead',elements:wui.toElements(
				{tag:'tr',elements:wui.toElements(
					{tag:'th',text:'Card'},
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
			)}
		)};
	
	return elementDef;
};

CardSummarySection.prototype.getSummaryTableBody = function() {
	return this.getHtmlElement('summaryTable.body');
};

CardSummarySection.prototype.refresh = function() {
	var summaryTableBody = this.getSummaryTableBody();
	var summaryTable = this.appData.getCardSummary(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear(), 12);
	var _ = {tag:'td'};
	var elements = [];
	
	/* Set Card Rows */
	for (var card in summaryTable) {
			var tr = {tag:'tr'};
			tr.elements = [];
			tr.elements.push({tag:'th',text:card});
			for (var m=0; m<summaryTable[card].length; m++) {
				tr.elements.push({tag:'td',className:'neg',text:wui.format(summaryTable[card][m])});
			}
			elements.push(tr);
	}
	
	/* Update Container */
	wui.clearChildElements(summaryTableBody);
	wui.createHtmlElements(elements, summaryTableBody);
};

CardSummarySection.prototype.updateOpening = function(w3cEvent) {
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

CardSummarySection.prototype.updateClosing = function(w3cEvent) {
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

CardSummarySection.prototype.saveAccount = function(w3cEvent) {
	this.data.saveAccount();
};