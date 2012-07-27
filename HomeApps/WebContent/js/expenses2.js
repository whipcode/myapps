function Expenses2(htmlId) {
	this.setContext(htmlId);
	
	this.add(WuiWrapper, 'AppsMenu');
	var appSpace = this.add(WuiWrapper, 'AppSpace');
	if (appSpace) {
		var app = appSpace.add(ExpensesApp);
		
		/* load data */
		dao.load();
		app.refresh();
	}
}
Expenses2.prototype = new WuiElement();

function ExpensesApp(className, attr, callbacks) {
	this.newHtmlElement('div', 'ExpensesApp', {attr:{activeSection:'accountSummary'}});
	var _this = this;
	
	var menu = this.add(WuiWrapper, 'Menu');
	if (menu) {
		menu.add(WuiLink, '', {text:'Account Summary', attr:{sectionName:'accountSummary'}}, {click:function(evt) {_this.changeSection('accountSummary');}});
		menu.add(WuiLink, '', {text:'Incomes', attr:{sectionName:'incomes'}}, {click:function(evt) {_this.changeSection('incomes');}});
		menu.add(WuiLink, '', {text:'Expenditures', attr:{sectionName:'expenditures'}}, {click:function(evt) {_this.changeSection('expenditures');}});
		menu.add(WuiLink, '', {text:'Shoppings', attr:{sectionName:'shoppings'}}, {click:function(evt) {_this.changeSection('shoppings');}});
		menu.add(WuiLink, '', {text:'Investments', attr:{sectionName:'investments'}}, {click:function(evt) {_this.changeSection('investments');}});
		menu.add(WuiLink, '', {text:'Transfers', attr:{sectionName:'transfers'}}, {click:function(evt) {_this.changeSection('transfers');}});
		menu.add(WuiLink, '', {text:'Monthly Summary', attr:{sectionName:'monthlySummary'}}, {click:function(evt) {_this.changeSection('monthlySummary');}});
		menu.add(WuiLink, '', {text:'Card Summary', attr:{sectionName:'cardSummary'}}, {click:function(evt) {_this.changeSection('cardSummary');}});
		menu.add(WuiLink, '', {text:'Asset Summary', attr:{sectionName:'assetSummary'}}, {click:function(evt) {_this.changeSection('assetSummary');}});
		menu.add(WuiLink, '', {text:'Reminder', attr:{sectionName:'reminders'}}, {click:function(evt) {_this.changeSection('reminders');}});
	}
	
	this.filters = this.add(WuiWrapper, 'Filters');
	if (this.filters) {
		this.filters.account = this.filters.add(WuiSelectionField, '', {label:'Account: '}, {
			change:function(evt) {_this.refresh('sections');}
		});
		
		this.filters.year = this.filters.add(WuiSelectionField, '', {label:'Year: '},{
			change:function(evt) {_this.refresh('sections');}
		});
		if (this.filters.year) {
			var year = (new Date()).getFullYear() - 1;
			for (var i=0; i<10; i++) {
				this.filters.year.addOption('', {text:year+i});
			}
			this.filters.year.setSelectedIdx(1);
		}
		
		this.filters.month = this.filters.add(WuiSelectionField, '', {label:'Month: '},{
			change:function(evt) {_this.refresh('sections');}
		});
		if (this.filters.month) {
			for (var i=0; i<12; i++) {
				this.filters.month.addOption('', {text:dao.settings.monthLabels[i]});
			}
			this.filters.month.setSelectedIdx((new Date()).getMonth());
		}
		
		this.filters.add(WuiButton, '', {text:'Save to Excel'}, {click:function(evt) {_this.saveToExcel();}});
		
		this.filters.add(WuiButton, '', {text:'New Transaction'},{
			click:function(evt) {
				var date = new Date(_this.getSelectedYear(), _this.getSelectedMonth(), 1);
				var today = wui.dateUtil.getToday();
				if (date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth())
					date = today;
				var transaction = new Transaction(_this.getSelectedAccount(), 0, date);
				
				switch (_this.getAttribute('activeSection')) {
				case 'incomes':
					transaction.tranxCatg = Transaction.CATG.INCOME;
					break;
				case 'expenditures':
					transaction.tranxCatg = Transaction.CATG.EXPENDITURE;
					break;
				case 'shoppings':
					transaction.tranxCatg = Transaction.CATG.SHOPPING;
					break;
				case 'investments':
					transaction.tranxCatg = Transaction.CATG.INVESTMENT;
					break;
				case 'transfers':
					transaction.tranxCatg = Transaction.CATG.TRANSFER;
					break;
				}
				
				_this.transactionForm.show(transaction);
			}
		});
	}
	
	this.sections = this.add(WuiWrapper, 'Sections');
	if (this.sections) {
		this.sections.accountSummary = this.sections.add(AccountSummary);
		this.sections.incomes = this.sections.add(TransactionSection, 'Incomes');
		this.sections.expenditures = this.sections.add(TransactionSection, 'Expenditures');
		this.sections.shoppings = this.sections.add(TransactionSection, 'Shoppings');
		this.sections.investments = this.sections.add(TransactionSection, 'Investments');
		this.sections.transfers = this.sections.add(TransactionSection, 'Transfers');
		this.sections.monthlySummary = this.sections.add(TransactionSection, 'MonthlySummary');
		this.sections.cardSummary = this.sections.add(CardSummary);
		this.sections.assetSummary = this.sections.add(AssetSummary);
		this.sections.reminders = this.sections.add(ReminderSection);
	}
	
	this.transactionForm = this.add(TransactionForm);
	this.assetForm = this.add(AssetForm);
}
ExpensesApp.prototype = new WuiElement();

ExpensesApp.prototype.getSelectedAccount = function() {
	return this.filters.account.getSelectedOption().getUserData();
};

ExpensesApp.prototype.getSelectedYear = function() {
	return this.filters.year.getSelectedValue();
};

ExpensesApp.prototype.getSelectedMonth = function() {
	return this.filters.month.getSelectedIdx();
};

ExpensesApp.prototype.refresh = function(area) {
	if (!area || area == 'filters') {
		var accounts = dao.getAccounts();
		
		this.filters.account.clearOptions();
		for (var i in accounts) {
			this.filters.account.addOption('', {text:accounts[i].accName,userData:accounts[i]});
		}
	}
	
	if (!area || area == 'sections') {
		var selectedAccount = this.getSelectedAccount();
		var selectedYear = this.getSelectedYear();
		var selectedMonth = this.getSelectedMonth();
		
		this.sections.accountSummary.refresh(selectedAccount, selectedYear);
		this.sections.incomes.refresh(selectedAccount, selectedYear, selectedMonth, Transaction.CATG.INCOME);
		this.sections.expenditures.refresh(selectedAccount, selectedYear, selectedMonth, Transaction.CATG.EXPENDITURE);
		this.sections.shoppings.refresh(selectedAccount, selectedYear, selectedMonth, Transaction.CATG.SHOPPING);
		this.sections.investments.refresh(selectedAccount, selectedYear, selectedMonth, Transaction.CATG.INVESTMENT);
		this.sections.transfers.refresh(selectedAccount, selectedYear, selectedMonth, Transaction.CATG.TRANSFER);
		this.sections.monthlySummary.refresh(selectedAccount, selectedYear, selectedMonth);
		this.sections.cardSummary.refresh(selectedAccount, selectedYear, selectedMonth);
		this.sections.reminders.refresh(selectedAccount, selectedYear, selectedMonth);
	}

	if (!area || area == 'sections' || area == 'asset') {
		var selectedYear = this.getSelectedYear();
		var selectedMonth = this.getSelectedMonth();

		this.sections.assetSummary.refresh(selectedYear, selectedMonth);
	}
};

ExpensesApp.prototype.changeSection = function(section) {
	this.setAttribute('activeSection', section);
};

ExpensesApp.prototype.saveToExcel = function() {
	var filename = 'transaction-'+this.getSelectedAccount().id+'-'+ this.getSelectedYear()+'-'+ (this.getSelectedMonth()+1)+'.xls';
	var url = window.contextRoot + '/xls/'+filename;
	var iframe = document.createElement('iframe');
	iframe.src = url;
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
};

function AccountSummary(className, attr, callbacks) {
	this.newHtmlElement('div', 'AccountSummary');
	
	this.table = this.add(WuiTable);
	if (this.table) {
		this.table.thead = this.table.add(WuiTableHeader);
		if (this.table.thead) {
			var tr = this.table.thead.add(WuiTableRow);
			if (tr) {
				tr.add(WuiTableHeaderCell);
				
				for (var i=0; i<12; i++) {
					tr.add(WuiTableHeaderCell, '', {text:dao.settings.monthLabels[i].toUpperCase()});
				}
			}
		}
		
		this.table.tbody = this.table.add(WuiTableBody);
	}
}
AccountSummary.prototype = new WuiElement();

AccountSummary.prototype.refresh = function(account, year) {
	var accountSummary = dao.getAccountSummary(account, year);
	this.currentAccount = account;
	this.currentYear = year;
	var _this = this;
	var monthExpenses = [0,0,0,0,0,0,0,0,0,0,0,0];
	
	this.table.tbody.removeChildElements();
	this.opening = [];
	this.closing = [];
	this.difference = [];
	
	/* Opening */
	var tr = this.table.tbody.add(WuiTableRow, 'opening');
	tr.add(WuiTableHeaderCell, '', {text:'Opening'});
	for (var m=0; m<12; m++) {
		this.opening[m] = tr.add(WuiTableCell).add(WuiTextInput, '', 
			{
				value:dao.format(accountSummary.opening[m]),
				userData:{
					monthlyBalance:accountSummary.monthlyBalances[m]?accountSummary.monthlyBalances[m].opening:null,
					monthIdx:m
					}
			},
			{
				change:function(evt) {
					var srcElement = evt.srcElement;
					_this.updateOpening(srcElement.userData.monthIdx, dao.parseString(0, srcElement.value));
				}
			});
	}
	
	/* Expenses */
	for (var catg in accountSummary.transactions) {
		var tr = this.table.tbody.add(WuiTableRow, 'expenseGrp');
		tr.add(WuiTableHeaderCell, '', {text:catg});
		for (var m=0; m<12;m++) {
			var subttl = 0;
			for (var t in accountSummary.transactions[catg])
				if (accountSummary.transactions[catg][t][m]) subttl += accountSummary.transactions[catg][t][m];
			if (subttl != 0)
				tr.add(WuiTableCell, '', {text:dao.format(subttl)});
			else
				tr.add(WuiTableCell);
		}
		
		for (var subcatg in accountSummary.transactions[catg]) {
			var tr = this.table.tbody.add(WuiTableRow, 'expenseDtl');
			tr.add(WuiTableHeaderCell, '', {text:subcatg});
			for (var m=0; m<12; m++) {
				tr.add(WuiTableCell, accountSummary.transactions[catg][subcatg][m]<0?'neg':'', {text:dao.format(accountSummary.transactions[catg][subcatg][m])});
				monthExpenses[m] += accountSummary.transactions[catg][subcatg][m]||0;
			}
		}
	}
	
	/* Closing */
	var tr = this.table.tbody.add(WuiTableRow, 'closing');
	tr.add(WuiTableHeaderCell, '', {text:'Closing'});
	for (var m=0; m<12; m++) {
		this.closing[m] = tr.add(WuiTableCell).add(WuiTextInput, '', 
			{
				value:dao.format(accountSummary.closing[m]),
				userData:{
					monthlyBalance:accountSummary.monthlyBalances[m]?accountSummary.monthlyBalances[m].closing:null,
					monthIdx:m,
					monthExpenses:monthExpenses[m]
				}
			},
			{
				change:function(evt) {
					var srcElement = evt.srcElement;
					_this.updateClosing(srcElement.userData.monthIdx, dao.parseString(0, srcElement.value));
				}
			});
	}
	
	/* Differences */
	var tr = this.table.tbody.add(WuiTableRow, 'difference');
	tr.add(WuiTableHeaderCell, '', {text:'?'});
	for (var m=0; m<12; m++) {
		this.difference[m] = tr.add(WuiTableCell, accountSummary.difference[m]<0?'neg':'', {text:dao.format(accountSummary.difference[m])});
	}
};

AccountSummary.prototype.updateOpening = function(monthIdx, newValue) {
	var opening = this.opening[monthIdx].getUserData()['monthlyBalance'];
	if (!opening) {
		opening = new Balance(this.currentAccount, new Date(this.currentYear, monthIdx, 1), Balance.TYPE.OPENING, newValue);
		this.opening[monthIdx].getUserData()['monthlyBalance'] = opening;
	}
	else
		opening.amount = newValue;
	
	if (!this.closing[monthIdx].getUserData()['monthlyBalance'])
		this.closing[monthIdx].setValue(dao.format(newValue + this.closing[monthIdx].getUserData()['monthExpenses']));
	else {
		this.difference[monthIdx].setText(dao.format(dao.parseString(0,this.closing[monthIdx].getValue()) - dao.parseString(0,this.opening[monthIdx].getValue()) - this.closing[monthIdx].getUserData()['monthExpenses']));
		this.difference[monthIdx].setClass(dao.parseString(0,this.difference[monthIdx].getText())<0?'neg':'');
	}

	for (var m=monthIdx+1; m<12; m++) {
		if (this.opening[m].getUserData()['monthlyBalance'])
			break;
		this.opening[m].setValue(this.closing[m-1].getValue());
		
		if (this.closing[m].getUserData()['monthlyBalance']) {
			this.difference[m].setText(dao.format(dao.parseString(0,this.closing[m].getValue()) - dao.parseString(0,this.opening[m].getValue()) - this.closing[m].getUserData()['monthExpenses']));
			this.difference[m].setClass(dao.parseString(0,this.difference[m].getText())<0?'neg':'');
			break;
		}
		this.closing[m].setValue(dao.format(dao.parseString(0,this.opening[m].getValue()) + this.closing[m].getUserData()['monthExpenses']));
	}
	
	dao.saveMonthlyBalance(opening);
};

AccountSummary.prototype.updateClosing = function(monthIdx, newValue) {
	var closing = this.closing[monthIdx].getUserData()['monthlyBalance'];
	if (!closing) {
		closing = new Balance(this.currentAccount, new Date(this.currentYear, monthIdx, 1), Balance.TYPE.CLOSING, newValue);
		this.closing[monthIdx].getUserData()['monthlyBalance'] = closing;
	}
	else
		closing.amount = newValue;
	
	this.difference[monthIdx].setText(dao.format(dao.parseString(0,this.closing[monthIdx].getValue()) - dao.parseString(0,this.opening[monthIdx].getValue()) - this.closing[monthIdx].getUserData()['monthExpenses']));
	this.difference[monthIdx].setClass(dao.parseString(0,this.difference[monthIdx].getText())<0?'neg':'');

	for (var m=monthIdx+1; m<12; m++) {
		if (this.opening[m].getUserData()['monthlyBalance'])
			break;
		this.opening[m].setValue(this.closing[m-1].getValue());
		
		if (this.closing[m].getUserData()['monthlyBalance']) {
			this.difference[m].setText(dao.format(dao.parseString(0,this.closing[m].getValue()) - dao.parseString(0,this.opening[m].getValue()) - this.closing[m].getUserData()['monthExpenses']));
			this.difference[m].setClass(dao.parseString(0,this.difference[m].getText())<0?'neg':'');
			break;
		}
		this.closing[m].setValue(dao.format(dao.parseString(0,this.opening[m].getValue()) + this.closing[m].getUserData()['monthExpenses']));
	}
	
	dao.saveMonthlyBalance(closing);
};

function TransactionSection(className, attr, callbacks) {
	this.newHtmlElement('div', className);
	
	this.table = this.add(WuiTable);
	if (this.table) {
		var tr = this.table.add(WuiTableHeader).add(WuiTableRow);
		if (tr) {
			tr.add(WuiTableHeaderCell);
			tr.add(WuiTableHeaderCell, '', {text:'Bank Date'});
			tr.add(WuiTableHeaderCell, '', {text:'Description'});
			tr.add(WuiTableHeaderCell, '', {text:'Amount'});
			tr.add(WuiTableHeaderCell, '', {text:'Category'});
			tr.add(WuiTableHeaderCell, '', {text:'Sub Catg'});
			tr.add(WuiTableHeaderCell, '', {text:'Card'});
			tr.add(WuiTableHeaderCell, '', {text:'Reminder'});
			tr.add(WuiTableHeaderCell, '', {text:'Remarks'});
		}
		
		this.table.tbody = this.table.add(WuiTableBody);
	}
}
TransactionSection.prototype = new WuiElement();

TransactionSection.prototype.refresh = function(account, year, month, catg) {
	var transactions = dao.getTransactionRecs(account, year, month, catg);
	var _this = this;

	this.table.tbody.removeChildElements();
	
	for (var i in transactions) {
		var tr = this.table.tbody.add(WuiTableRow, '', {userData:transactions[i]}, {dblclick:function(evt) {_this.editTransaction(evt.currentTarget.userData);}});
		if (tr) {
			tr.add(WuiTableCell).add(WuiButton, '', {text:'Delete',userData:transactions[i]}, {click:function(evt) {_this.deleteTransaction(evt.currentTarget.userData);}});
			tr.add(WuiTableCell, '', {text:dao.format(transactions[i].bankDate)});
			tr.add(WuiTableCell, '', {text:transactions[i].desc});
			tr.add(WuiTableCell, '', {text:dao.format(transactions[i].amount)});
			tr.add(WuiTableCell, '', {text:transactions[i].tranxCatg});
			tr.add(WuiTableCell, '', {text:transactions[i].tranxSubcatg});
			tr.add(WuiTableCell, '', {text:transactions[i].creditCard});
			if (transactions[i].reminderMsg)
				tr.add(WuiTableCell, '', {text:transactions[i].reminderMsg+(transactions[i].remindDate?' ('+dao.format(transactions[i].remindDate)+')':'')});
			else
				tr.add(WuiTableCell);
			tr.add(WuiTableCell, '', {text:transactions[i].remarks});
		}
	}
};

TransactionSection.prototype.editTransaction = function(transaction) {
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp) {
		expensesApp.transactionForm.show(transaction);
	}
};

TransactionSection.prototype.deleteTransaction = function(transaction) {
	dao.deleteTransaction(transaction);

	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp) {
		expensesApp.refresh('sections');
	}
};

function TransactionForm(className, attr, callbacks) {
	this.newHtmlElement('div', 'Popup');
	var _this = this;
	
	this.form = this.add(WuiWrapper, 'TransactionForm');
	if (this.form) {
		this.form.bankDate = this.form.add(WuiTextField, '', {label:'Bank Date'});
		this.form.amount = this.form.add(WuiTextField, '', {label:'Amount'});
		this.form.desc = this.form.add(WuiTextField, '', {label:'Description'});
		this.form.catg = this.form.add(WuiTextField, '', {label:'Category'});
		this.form.subCatg = this.form.add(WuiTextField, '', {label:'Sub Category'});
		this.form.card = this.form.add(WuiTextField, '', {label:'Card'});
		this.form.reminder = this.form.add(WuiTextField, '', {label:'Reminder'});
		if (this.form.reminder) {
			this.form.reminder.date = this.form.reminder.add(WuiTextInput);
			this.form.reminder.checkbox = this.form.reminder.add(WuiCheckbox);
		}
		this.form.remarks = this.form.add(WuiTextField, '', {label:'Remarks'});
		
		/* enable auto complete */
		this.form.catg.enableAutoComplete(function(input) {return _this.autoCompleteFn(dao.getAccountTranxCatgs(_this.findParent(ExpensesApp).getSelectedAccount()), input);});
		this.form.subCatg.enableAutoComplete(function(input) {return _this.autoCompleteFn(dao.getAccountTranxSubcatgs(_this.findParent(ExpensesApp).getSelectedAccount()), input);});
		this.form.card.enableAutoComplete(function(input) {return _this.autoCompleteFn(dao.getAccountCards(_this.findParent(ExpensesApp).getSelectedAccount()), input);});

		var buttons = this.form.add(WuiWrapper, 'Buttons');
		if (buttons) {
			buttons.add(WuiButton, '', {text:'Repeat'}, {click:function(evt) {_this.showRepeatForm();}});
			buttons.add(WuiButton, '', {text:'Update Repeat Auto'}, {click:function(evt) {_this.saveRepeatAuto();}});
			buttons.add(WuiButton, '', {text:'Save'}, {click:function(evt) {_this.save();}});
			buttons.add(WuiButton, '', {text:'Cancel'},{click:function(evt) {_this.hide();}});
		}
	}
	
	this.repeatForm = this.add(WuiWrapper, 'Popup');
	if (this.repeatForm) {
		this.repeatForm.form = this.repeatForm.add(WuiWrapper, 'RepeatForm');
		if (this.repeatForm.form) {
			this.repeatForm.form.everyN = this.repeatForm.form.add(WuiTextField, '', {label:'Every N Months',value:'1'});
			this.repeatForm.form.repeatN = this.repeatForm.form.add(WuiTextField, '', {label:'Repeat N Times',value:'1'});
			
			var buttons = this.repeatForm.form.add(WuiWrapper, 'Buttons');
			if (buttons) {
				buttons.add(WuiButton, '', {text:'Save'}, {click:function(evt) {_this.saveRepeat();}});
				buttons.add(WuiButton, '', {text:'Cancel'}, {click:function(evt) {_this.hideRepeatForm();}});
			}
		}
	}
}
TransactionForm.prototype = new WuiElement();

TransactionForm.prototype.autoCompleteFn = function(list, input) {
	for (var i in list) {
		var idx = list[i].toLowerCase().indexOf(input.toLowerCase());
		if (idx == 0 && list[i].length > input.length)
			return list[i];
	}
};

TransactionForm.prototype.show = function(transaction) {
	this.form.bankDate.setValue(dao.format(transaction.bankDate));
	this.form.amount.setValue(dao.format(transaction.amount));
	this.form.desc.setValue(transaction.desc);
	this.form.catg.setValue(transaction.tranxCatg);
	this.form.subCatg.setValue(transaction.tranxSubcatg);
	this.form.card.setValue(transaction.creditCard);
	this.form.reminder.setValue(transaction.reminderMsg);
	this.form.reminder.date.setValue(dao.format(transaction.remindDate));
	this.form.reminder.checkbox.setValue(transaction.remind);
	this.form.remarks.setValue(transaction.remarks);

	this.transaction = transaction;

	this.setAttribute('show','yes');
};

TransactionForm.prototype.hide = function() {
	this.setAttribute('show','no');
};

TransactionForm.prototype.showRepeatForm = function() {
	this.repeatForm.setAttribute('show','yes');
};

TransactionForm.prototype.hideRepeatForm = function() {
	this.repeatForm.setAttribute('show','no');
};

TransactionForm.prototype.save = function() {
	dao.parseString(this.transaction.bankDate, this.form.bankDate.getValue());
	this.transaction.amount = dao.parseString(0, this.form.amount.getValue());
	this.transaction.desc = this.form.desc.getValue();
	this.transaction.tranxCatg = this.form.catg.getValue();
	this.transaction.tranxSubcatg = this.form.subCatg.getValue();
	this.transaction.creditCard = this.form.card.getValue();
	this.transaction.reminderMsg = this.form.reminder.getValue();
	this.transaction.remindDate = dao.parseString(new Date(1,1,1), this.form.reminder.date.getValue());
	this.transaction.remind = this.form.reminder.checkbox.getValue();
	this.transaction.remarks = this.form.remarks.getValue();
	
	switch (this.transaction.tranxCatg) {
	case Transaction.CATG.INCOME:
		if (this.transaction.amount < 0) this.transaction.amount = -this.transaction.amount;
		break;
	case Transaction.CATG.EXPENDITURE:
	case Transaction.CATG.SHOPPING:
		if (this.transaction.amount > 0) this.transaction.amount = -this.transaction.amount;
		break;
	}
	
	dao.saveTransaction(this.transaction);
	
	this.hide();
	
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp)
		expensesApp.refresh('sections');
};

TransactionForm.prototype.saveRepeat = function() {
	dao.parseString(this.transaction.bankDate, this.form.bankDate.getValue());
	this.transaction.amount = dao.parseString(0, this.form.amount.getValue());
	this.transaction.desc = this.form.desc.getValue();
	this.transaction.tranxCatg = this.form.catg.getValue();
	this.transaction.tranxSubcatg = this.form.subCatg.getValue();
	this.transaction.creditCard = this.form.card.getValue();
	this.transaction.reminderMsg = this.form.reminder.getValue();
	this.transaction.remindDate = dao.parseString(new Date(), this.form.reminder.date.getValue());
	this.transaction.remind = this.form.reminder.checkbox.getValue();
	this.transaction.remarks = this.form.remarks.getValue();
	
	switch (this.transaction.tranxCatg) {
	case Transaction.CATG.INCOME:
		if (this.transaction.amount < 0) this.transaction.amount = -this.transaction.amount;
		break;
	case Transaction.CATG.EXPENDITURE:
	case Transaction.CATG.SHOPPING:
		if (this.transaction.amount > 0) this.transaction.amount = -this.transaction.amount;
		break;
	}
	
	var repeatDtl = new RepeatDtl();
	repeatDtl.everyN = dao.parseString(0,this.repeatForm.form.everyN.getValue());
	repeatDtl.repeatN = dao.parseString(0,this.repeatForm.form.repeatN.getValue());
	
	dao.saveTransactions(this.transaction, repeatDtl);
	
	this.hideRepeatForm();
	this.hide();
	
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp)
		expensesApp.refresh('sections');
};

TransactionForm.prototype.saveRepeatAuto = function() {
	dao.parseString(this.transaction.bankDate, this.form.bankDate.getValue());
	this.transaction.amount = dao.parseString(0, this.form.amount.getValue());
	this.transaction.desc = this.form.desc.getValue();
	this.transaction.tranxCatg = this.form.catg.getValue();
	this.transaction.tranxSubcatg = this.form.subCatg.getValue();
	this.transaction.creditCard = this.form.card.getValue();
	this.transaction.reminderMsg = this.form.reminder.getValue();
	dao.parseString(this.transaction.remindDate, this.form.reminder.date.getValue());
	this.transaction.remind = this.form.reminder.checkbox.getValue();
	this.transaction.remarks = this.form.remarks.getValue();
	
	switch (this.transaction.tranxCatg) {
	case Transaction.CATG.INCOME:
		if (this.transaction.amount < 0) this.transaction.amount = -this.transaction.amount;
		break;
	case Transaction.CATG.EXPENDITURE:
	case Transaction.CATG.SHOPPING:
		if (this.transaction.amount > 0) this.transaction.amount = -this.transaction.amount;
		break;
	}
	
	dao.saveTransactionsRepeatAuto(this.transaction);
	
	this.hide();
	
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp)
		expensesApp.refresh('sections');
};

function CardSummary(className, attr, callbacks) {
	this.newHtmlElement('div', 'CardSummary');
	
	this.table = this.add(WuiTable);
	if (this.table) {
		var tr = this.table.add(WuiTableHeader).add(WuiTableRow);
		if (tr) {
			tr.add(WuiTableHeaderCell);
			tr.add(WuiTableHeaderCell, '', {text:'Bank Date'});
			tr.add(WuiTableHeaderCell, '', {text:'Description'});
			tr.add(WuiTableHeaderCell, '', {text:'Amount'});
			tr.add(WuiTableHeaderCell, '', {text:'Category'});
			tr.add(WuiTableHeaderCell, '', {text:'Sub Catg'});
			tr.add(WuiTableHeaderCell, '', {text:'Remarks'});
		}
		
		this.table.tbody = this.table.add(WuiTableBody);
	}
}
CardSummary.prototype = new WuiElement();

CardSummary.prototype.refresh = function(account, year, month) {
	var _this = this;
	var cardSummary = dao.getCardSummary(account, year, month);
	
	this.table.tbody.removeChildElements();
	
	for (var card in cardSummary) {
		var tr = this.table.tbody.add(WuiTableRow, 'Card');
		if (tr) {
			tr.add(WuiTableHeaderCell, '', {text:card});
			tr.add(WuiTableHeaderCell, '', {text:dao.format(cardSummary[card].total)});
			tr.add(WuiTableCell);
			tr.add(WuiTableCell);
			tr.add(WuiTableCell);
			tr.add(WuiTableCell);
			tr.add(WuiTableCell);
		}
		
		for (var i in cardSummary[card].transactions) {
			var transactions = cardSummary[card].transactions;
			
			var tr = this.table.tbody.add(WuiTableRow, 'Transaction', {userData:transactions[i]}, {dblclick:function(evt) {_this.editTransaction(evt.currentTarget.userData);}});
			if (tr) {
				tr.add(WuiTableCell).add(WuiButton, '', {text:'Delete',userData:transactions[i]}, {click:function(evt) {_this.deleteTransaction(evt.currentTarget.userData);}});
				tr.add(WuiTableCell, '', {text:dao.format(transactions[i].bankDate)});
				tr.add(WuiTableCell, '', {text:transactions[i].desc});
				tr.add(WuiTableCell, '', {text:dao.format(transactions[i].amount)});
				tr.add(WuiTableCell, '', {text:transactions[i].tranxCatg});
				tr.add(WuiTableCell, '', {text:transactions[i].tranxSubcatg});
				tr.add(WuiTableCell, '', {text:transactions[i].remarks});
			}
		}
	}
};

CardSummary.prototype.editTransaction = function(transaction) {
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp) {
		expensesApp.transactionForm.show(transaction);
	}
};

CardSummary.prototype.deleteTransaction = function(transaction) {
	dao.deleteTransaction(transaction);

	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp) {
		expensesApp.refresh('sections');
	}
};

function AssetSummary(className, attr, callbacks) {
	this.newHtmlElement('div', 'AssetSummary');
	
	this.table = this.add(WuiTable);
}
AssetSummary.prototype = new WuiElement();

AssetSummary.prototype.refresh = function(year, month) {
	var _this = this;
	var assetSummary = dao.getAssetSummary(year, month);
	this.year = year;
	this.month = month;

	this.table.removeChildElements();
	var tr = this.table.add(WuiTableHeader).add(WuiTableRow);
	if (tr) {
		tr.add(WuiTableHeaderCell).add(WuiButton, '', {text:'New'}, {click:function(evt) {_this.editAsset(new Asset());}});
		for (var owner in assetSummary.owners) {
			tr.add(WuiTableCell, '', {text:owner});
		}
		tr.add(WuiTableCell);	/* dummy space column */
	}
	
	this.table.tbody = this.table.add(WuiTableBody);
	if (this.table.tbody) {
		for (var category in assetSummary.assetEntries) {
			var assetEntries = assetSummary.assetEntries[category];
			
			this.table.tbody[category] = this.table.tbody.add(WuiTableRow, 'Category');
			if (this.table.tbody[category]) {
				this.table.tbody[category].add(WuiTableHeaderCell, '', {text:category});
				for (var owner in assetSummary.owners)
					this.table.tbody[category][owner] = this.table.tbody[category].add(WuiTableCell, '', {text:dao.format(assetSummary.categories[category][owner].value||'')});
				this.table.tbody[category].add(WuiTableCell);	/* dummy space column */
			}
			
			for (var assetName in assetEntries) {
				var assetEntry = assetEntries[assetName];
				
				this.table.tbody[category][assetName] = this.table.tbody.add(WuiTableRow, 'Asset');
				if (this.table.tbody[category][assetName]) {
					this.table.tbody[category][assetName].add(WuiTableHeaderCell, '', {text:assetEntry['Home'].asset.name, userData:{assetEntry:assetEntry}}, {
						click:function(evt) {
							var asset = evt.srcElement.userData.assetEntry['Home'].asset;
							if (asset.id > 0)
								_this.editAsset(asset);
						}
					});
					
					for (var owner in assetEntry) {
						var assetValue = assetEntry[owner];
						
						this.table.tbody[category][assetName][owner] = this.table.tbody[category][assetName].add(WuiTableCell, '', 
							{
								text:dao.format(assetValue.value||''),
								attr:{contentEditable:assetValue.asset.id?'true':'false'},
								userData:{assetValue:assetValue}
							}, {
								focus:function(evt) {
									var srcElement = evt.srcElement;
									srcElement.textContent = srcElement.userData.assetValue.valueStr;
									srcElement.setAttribute('b4valueStr',srcElement.userData.assetValue.valueStr);
								},
								blur:function(evt) {
									var srcElement = evt.srcElement;
									srcElement.userData.assetValue.valueStr = srcElement.textContent;
									if (srcElement.userData.assetValue.valueStr.length > 0)
										srcElement.userData.assetValue.value = eval(srcElement.userData.assetValue.valueStr);
									else
										srcElement.userData.assetValue.value = 0;
									
									srcElement.textContent = dao.format(srcElement.userData.assetValue.value||'');
										
									if (srcElement.getAttribute('b4valueStr') != srcElement.userData.assetValue.valueStr) {
										dao.saveAssetValue(srcElement.userData.assetValue);
										_this.updateTotal(srcElement.userData.assetValue);
									}
								},
								keypress:function(evt) {
									switch (evt.keyCode) {
									case 13:
										evt.srcElement.blur();
									}
								}
							});
					}
					
					this.table.tbody[category][assetName].add(WuiTableCell);	/* dummy space column */
				}
			}
		}
	}
	
	this.table.tfoot = this.table.add(WuiTableFooter);
	if (this.table.tfoot) {
		var grandTotal = 0;
		var tr = this.table.tfoot.add(WuiTableRow, 'Total');
		if (tr) {
			tr.add(WuiTableHeaderCell, '', {text:'Total'});
			
			for (var owner in assetSummary.owners) {
				this.table.tfoot[owner] = tr.add(WuiTableCell, '', {text:dao.format(assetSummary.owners[owner].value)});

				grandTotal += assetSummary.owners[owner].value;
			}
			tr.add(WuiTableCell);	/* dummy space column */
		}
	}
};

AssetSummary.prototype.editAsset = function(asset) {
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp) {
		expensesApp.assetForm.show(asset);
	}
};

AssetSummary.prototype.updateTotal = function(assetValue) {
	var assetSummary = dao.getAssetSummary(this.year, this.month);

	this.table.tbody[assetValue.asset.category][assetValue.owner].setText(dao.format(assetSummary.categories[assetValue.asset.category][assetValue.owner].value||''));
	this.table.tbody[assetValue.asset.category]['Total'].setText(dao.format(assetSummary.categories[assetValue.asset.category]['Total'].value||''));
	
	this.table.tbody[assetValue.asset.category][assetValue.asset.name]['Total'].setText(dao.format(assetSummary.assetEntries[assetValue.asset.category][assetValue.asset.name]['Total'].value));
	
	this.table.tfoot[assetValue.owner].setText(dao.format(assetSummary.owners[assetValue.owner].value));
	this.table.tfoot['Total'].setText(dao.format(assetSummary.owners['Total'].value));
};

function AssetForm(className, attr, callbacks) {
	this.newHtmlElement('div', 'Popup');
	var _this = this;
	
	this.form = this.add(WuiWrapper, 'AssetForm');
	if (this.form) {
		this.form.name = this.form.add(WuiTextField, '', {label:'Asset Name'});
		this.form.category = this.form.add(WuiTextField, '', {label:'Category'});
		this.form.discontinued = this.form.add(WuiCheckboxField, '', {label:'Discontinue?'});
		this.form.deleteMark = this.form.add(WuiCheckboxField, '', {label:'Delete?'});
		
		var buttons = this.form.add(WuiWrapper, 'Buttons');
		if (buttons) {
			buttons.add(WuiButton, '', {text:'Save'}, {click:function(evt) {_this.save();}});
			buttons.add(WuiButton, '', {text:'Cancel'}, {click:function(evt) {_this.hide();}});
		}
	}
}
AssetForm.prototype = new WuiElement();

AssetForm.prototype.show = function(asset) {
	this.form.name.setValue(asset.name);
	this.form.category.setValue(asset.category);
	this.form.discontinued.setValue(asset.discontinued);
	this.form.deleteMark.setValue(asset.deleted);
	
	this.asset = asset;

	this.setAttribute('show','yes');
};

AssetForm.prototype.hide = function() {
	this.setAttribute('show','no');
};

AssetForm.prototype.save = function() {
	this.asset.name = this.form.name.getValue();
	this.asset.category = this.form.category.getValue();
	this.asset.discontinued = this.form.discontinued.getValue();
	this.asset.deleteMark = this.form.deleteMark.getValue();
	
	dao.saveAsset(this.asset);
	this.hide();

	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp)
		expensesApp.refresh('asset');
};

function ReminderSection(className, attr, callbacks) {
	this.newHtmlElement('div', 'Reminders');
	
	this.table = this.add(WuiTable);
	if (this.table) {
		var tr = this.table.add(WuiTableHeader).add(WuiTableRow);
		if (tr) {
			tr.add(WuiTableHeaderCell, '', {text:'Reminder'});
			tr.add(WuiTableHeaderCell, '', {text:'Remind Date'});
			tr.add(WuiTableHeaderCell, '', {text:'Bank Date'});
			tr.add(WuiTableHeaderCell, '', {text:'Description'});
			tr.add(WuiTableHeaderCell, '', {text:'Amount'});
			tr.add(WuiTableHeaderCell, '', {text:'Category'});
			tr.add(WuiTableHeaderCell, '', {text:'Sub Catg'});
			tr.add(WuiTableHeaderCell, '', {text:'Card'});
			tr.add(WuiTableHeaderCell, '', {text:'Remarks'});
		}
		
		this.table.tbody = this.table.add(WuiTableBody);
	}
}
ReminderSection.prototype = new WuiElement();

ReminderSection.prototype.refresh = function(account, year, month) {
	var transactions = dao.getReminders(account, year, month);
	var _this = this;

	this.table.tbody.removeChildElements();
	
	for (var i in transactions) {
		var tr = this.table.tbody.add(WuiTableRow, '', {userData:transactions[i]}, {
			dblclick:function(evt) {_this.editTransaction(evt.currentTarget.userData);},
			change:function(evt) {_this.updateTransaction(evt.currentTarget.userData, evt.srcElement.checked);}});
		if (tr) {
			var td = tr.add(WuiTableCell);
			if (td) {
				td.add(WuiCheckbox, '', {checked:transactions[i].remind});
				td.add(WuiText, '', {tag:'span',text:transactions[i].reminderMsg});
			}
			tr.add(WuiTableCell, '', {text:dao.format(transactions[i].remindDate)});
			tr.add(WuiTableCell, '', {text:dao.format(transactions[i].bankDate)});
			tr.add(WuiTableCell, '', {text:transactions[i].desc});
			tr.add(WuiTableCell, '', {text:dao.format(transactions[i].amount)});
			tr.add(WuiTableCell, '', {text:transactions[i].tranxCatg});
			tr.add(WuiTableCell, '', {text:transactions[i].tranxSubcatg});
			tr.add(WuiTableCell, '', {text:transactions[i].creditCard});
			tr.add(WuiTableCell, '', {text:transactions[i].remarks});
		}
	}
};

ReminderSection.prototype.editTransaction = function(transaction) {
	var expensesApp = this.findParent(ExpensesApp);
	if (expensesApp) {
		expensesApp.transactionForm.show(transaction);
	}
};

ReminderSection.prototype.updateTransaction = function(transaction, remind) {
	transaction.remind = remind;
	dao.saveTransaction(transaction);
};

