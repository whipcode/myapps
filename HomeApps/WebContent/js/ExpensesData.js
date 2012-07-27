function ExpensesData() {
	this.accounts = [];
	this.assets = [];
	this.appCallbackObj = null;
	this.appState = {
		filters:{
			selectedAccountIdx:null,
			selectedYear:null,
			selectMonth:null
		}
	};
	
	dwr.engine.setAsync(false);
}

ExpensesData.prototype.newAccount = function(accName) {
	return {
		id:0,
		accName:accName,
  		deleteMark:false
	};
};

ExpensesData.prototype.addAccount = function(account) {
	this.accounts.push(account);
	BankAccountDao.saveAccount(account);
};

ExpensesData.prototype.updateAccount = function(account) {
	BankAccountDao.saveAccount(account);
};

ExpensesData.prototype.deleteAccount = function(account) {
	account.deleteMark = true;
	BankAccountDao.saveAccount(account);
};

ExpensesData.prototype.newMonthlyBalance = function(accountIdx, month, type, amount) {
	return {
		id:0,
		month:month,
		type:type,
		amount:amount,
		account:this.accounts[accountIdx],
  		deleteMark:false
	};
};

ExpensesData.prototype.addMonthlyBalance = function(monthlyBalance) {
	monthlyBalance.revised = 'Y';
	monthlyBalance.account.monthlyBalances.push(monthlyBalance);
	BankAccountDao.saveMonthlyBalance(monthlyBalance);
};

ExpensesData.prototype.updateMonthlyBalance = function(monthlyBalance) {
	monthlyBalance.revised = 'Y';
	BankAccountDao.saveMonthlyBalance(monthlyBalance);
};

ExpensesData.prototype.deleteMonthlyBalance = function(monthlyBalance) {
	monthlyBalance.deleteMark = true;
	BankAccountDao.saveMonthlyBalance(monthlyBalance);
};

ExpensesData.prototype.newTransaction = function(accountIdx, amount, bankDate, desc, tranxCatg, tranxSubcatg, remarks, repeatKey, creditCard) {
	return {
		id:0,
		amount:amount,
		bankDate:bankDate,
		desc:desc,
		tranxCatg:tranxCatg,
		tranxSubcatg:tranxSubcatg,
		remarks:remarks,
		repeatKey:repeatKey||(new Date()).valueOf(),
		creditCard:creditCard,
		account:this.accounts[accountIdx],
		shopping:null,
		transfer:null,
		installment:null,
		budget:null,
  		deleteMark:false
	};
};

ExpensesData.prototype.addTransaction = function(transaction) {
	BankAccountDao.saveTransaction(transaction, function(id) {transaction.id = id;});
	transaction.account.transactions.push(transaction);
};

ExpensesData.prototype.addTransactionRepeat = function(transaction, repeatDtl) {
	BankAccountDao.saveTransaction(transaction, function(id) {transaction.id = id;});
	transaction.account.transactions.push(transaction);
	for (var i=1; i<repeatDtl.repeatNTimes; i++) {
		var targetDate = (new Date(transaction.bankDate.toDateString())).addMonths(repeatDtl.everyNMonths*i);
		var targetTranx = this.newTransaction(0,transaction.amount,targetDate,transaction.desc,transaction.tranxCatg,transaction.tranxSubcatg,transaction.remarks,transaction.repeatKey,transaction.creditCard);
		targetTranx.account = transaction.account;
		
		BankAccountDao.saveTransaction(targetTranx, function(id) {targetTranx.id = id;});
		transaction.account.transactions.push(targetTranx);
	}
};

ExpensesData.prototype.addTransactionRepeatFast = function(transaction, repeatDtl) {
	var transactions = [];
	
	for (var i=0; i<repeatDtl.repeatNTimes; i++) {
		var targetDate = (new Date(transaction.bankDate.toDateString())).addMonths(repeatDtl.everyNMonths*i);
		var newTranx = this.newTransaction(0,transaction.amount,targetDate,transaction.desc,transaction.tranxCatg,transaction.tranxSubcatg,transaction.remarks,transaction.repeatKey,transaction.creditCard);
		newTranx.account = transaction.account;
		
		transactions.push(newTranx);
		transaction.account.transactions.push(newTranx);
	}
	
	BankAccountDao.saveTransactionRepeat(transactions, function(_transactions) {for (var i=0;i<_transactions.length;i++) {transactions[i].id=_transactions[i].id}});
};

ExpensesData.prototype.updateTransaction = function(transaction) {
	BankAccountDao.saveTransaction(transaction);
};

ExpensesData.prototype.updateTransactionRepeat = function(transaction, repeatDtl) {
	BankAccountDao.saveTransaction(transaction);
	for (var i=1; i<repeatDtl.repeatNTimes; i++) {
		var targetDate = (new Date(transaction.bankDate.toDateString())).addMonths(repeatDtl.everyNMonths*i);
		var targetTranx = this.newTransaction(0,transaction.amount,targetDate,transaction.desc,transaction.tranxCatg,transaction.tranxSubcatg,transaction.remarks,transaction.repeatKey,transaction.creditCard);
		targetTranx.account = transaction.account;
		
		for (var j=0,foundTranx=null; j<transaction.account.transactions.length; j++) {
			if (!transaction.account.transactions[j].deleteMark) {
				var t = transaction.account.transactions[j];
				if (t.repeatKey == transaction.repeatKey && t.bankDate.getFullYear() == targetDate.getFullYear() && t.bankDate.getMonth() == targetDate.getMonth()) {
					foundTranx = t;
				}
			}
		}
		
		if (foundTranx) {
			foundTranx.amount = targetTranx.amount;
			foundTranx.bankDate = targetTranx.bankDate;
			foundTranx.desc = targetTranx.desc;
			foundTranx.tranxSubcatg = targetTranx.tranxSubcatg;
			foundTranx.remarks = targetTranx.remarks;
			BankAccountDao.saveTransaction(foundTranx);
		}
		else {
			BankAccountDao.saveTransaction(targetTranx, function(id) {targetTranx.id = id;});
			transaction.account.transactions.push(targetTranx);
		}
	}
};

ExpensesData.prototype.updateTransactionRepeatFast = function(transaction, repeatDtl) {
	var transactions = [transaction];
	
	for (var i=1; i<repeatDtl.repeatNTimes; i++) {
		var targetDate = (new Date(transaction.bankDate.toDateString())).addMonths(repeatDtl.everyNMonths*i);
		
		for (var j=0,foundTranx=null; j<transaction.account.transactions.length; j++) {
			if (!transaction.account.transactions[j].deleteMark) {
				var t = transaction.account.transactions[j];
				if (t.repeatKey == transaction.repeatKey && t.bankDate.getFullYear() == targetDate.getFullYear() && t.bankDate.getMonth() == targetDate.getMonth()) {
					foundTranx = t;
				}
			}
		}
		
		if (foundTranx) {
			foundTranx.amount = transaction.amount;
			foundTranx.bankDate = targetDate;
			foundTranx.desc = transaction.desc;
			foundTranx.tranxSubcatg = transaction.tranxSubcatg;
			foundTranx.remarks = transaction.remarks;
			foundTranx.creditCard = transaction.creditCard;
			transactions.push(foundTranx);
		}
		else {
			var newTranx = this.newTransaction(0,transaction.amount,targetDate,transaction.desc,transaction.tranxCatg,transaction.tranxSubcatg,transaction.remarks,transaction.repeatKey,transaction.creditCard);
			newTranx.account = transaction.account;

			transactions.push(newTranx);
			transaction.account.transactions.push(newTranx);
		}
	}
	
	BankAccountDao.saveTransactionRepeat(transactions, function(_transactions) {for (var i=0;i<_transactions.length;i++) {transactions[i].id=_transactions[i].id}});
};

ExpensesData.prototype.updateTransactionRepeatAuto = function(transaction) {
	BankAccountDao.saveTransaction(transaction);
	
	var transactions = transaction.account.transactions;
	for (var j=0; j<transactions.length; j++) {
		if (!transactions[j].deleteMark && transactions[j].repeatKey == transaction.repeatKey && transactions[j].bankDate > transaction.bankDate) {
			var t = transactions[j];
			t.bankDate.setDate(transaction.bankDate.getDate());
			if (t.bankDate.getDate() != transaction.bankDate.getDate()) t.bankDate.setDate(0);
			t.amount = transaction.amount;
			t.desc = transaction.desc;
			t.tranxSubcatg = transaction.tranxSubcatg;
			t.remarks = transaction.remarks;
			BankAccountDao.saveTransaction(t);
		}
	}
};

ExpensesData.prototype.updateTransactionRepeatAutoFast = function(transaction) {
	var transactions = [transaction];
	
	var currTrans = transaction.account.transactions;
	for (var j=0; j<currTrans.length; j++) {
		if (!currTrans[j].deleteMark && currTrans[j].repeatKey == transaction.repeatKey && currTrans[j].bankDate > transaction.bankDate) {
			var t = currTrans[j];
			t.bankDate.setDate(transaction.bankDate.getDate());
			if (t.bankDate.getDate() != transaction.bankDate.getDate()) t.bankDate.setDate(0);
			t.amount = transaction.amount;
			t.desc = transaction.desc;
			t.tranxSubcatg = transaction.tranxSubcatg;
			t.remarks = transaction.remarks;
			t.creditCard = transaction.creditCard;
			transactions.push(t);
		}
	}
	
	BankAccountDao.saveTransactionRepeat(transactions, function(_transactions) {for (var i=0;i<_transactions.length;i++) {transactions[i].id=_transactions[i].id}});
};

ExpensesData.prototype.deleteTransaction = function(transaction) {
	transaction.deleteMark = true;
	BankAccountDao.saveTransaction(transaction);
};

ExpensesData.prototype.newBudget = function(accountIdx, amount, date, desc, budgetCatg, budgetSubcatg, remarks) {
	return {
		id:0,
		amount:amount,
		budgetDate:budgetDate,
		desc:desc,
		budgetCatg:budgetCatg,
		budgetSubcatg:budgetSubcatg,
		remarks:remarks,
		deemTransactions:[],
		account:this.accounts[accountIdx],
  		deleteMark:false
	};
};

ExpensesData.prototype.addBudget = function(accountIdx, budget) {
	this.accounts[accountIdx].budgets.push(budget);
	BankAccountDao.saveBudget(budget);
};

ExpensesData.prototype.updateBudget = function(budget) {
	BankAccountDao.saveBudget(budget);
};

ExpensesData.prototype.deleteBudget = function(budget) {
	budget.deleteMark = true;
	BankAccountDao.saveBudget(budget);
};

ExpensesData.prototype.saveAsset = function(asset) {
	var _this = this;
	BankAccountDao.saveAsset(asset, 
		function(_asset) {
			if (!asset.id) {
				_this.assets.push(_asset);
			}
			else {
				asset.lastUpdTs = _asset.lastUpdTs;
			}
		}
	);
};

ExpensesData.prototype.load = function(appCallbackObj) {
	var _this = this;
	this.appCallbackObj = appCallbackObj;
	
	BankAccountDao.getAssets(function(assets) {_this.assets = assets;});
	BankAccountDao.getAccounts(function(accounts) {_this.accounts = accounts;appCallbackObj.callback();});
};

ExpensesData.prototype.getAccountList = function() {
	var accountList = [];

	for (var a in this.accounts) {
		if (!this.accounts[a].deleteMark)
			accountList.push(this.accounts[a].accName);
	}
	
	return accountList;
};

ExpensesData.prototype.getYearList = function() {
	var yearList = [];
	var currentYear = new Date().getFullYear();

	yearList.push(currentYear);
	yearList.push(currentYear-1);
	for (var i=1;i<10;i++)
		yearList.push(currentYear+i);
	
	return yearList;
};

ExpensesData.prototype.getAccountSummary = function(accountIdx, year, numMonths) {
	function findYearOpening(account, year) {
		var yearOpening = 0;
		var lastMonthlyBalanceRec = null;
		
		for (var i in account.monthlyBalances) {
			var monthlyBalance = account.monthlyBalances[i];
			
			if (!monthlyBalance.deleteMark) {
				if (monthlyBalance.type == 'C') {
					monthlyBalance.month.setMonth(monthlyBalance.month.getMonth() + 1);
					monthlyBalance.type = 'O';
				}
			
				if (monthlyBalance.month.getFullYear() < year || (monthlyBalance.month.getFullYear() == year && monthlyBalance.month.getMonth() == 0))
					 lastMonthlyBalanceRec = monthlyBalance;
				else
					break;
			}
		}
		
		if (lastMonthlyBalanceRec) yearOpening = lastMonthlyBalanceRec.amount;
		
		for (var i in account.transactions) {
			var transaction = account.transactions[i];
			
			if (!transaction.deleteMark) {
				if (transaction.bankDate.getFullYear() < year) {
					if (!lastMonthlyBalanceRec || transaction.bankDate >= lastMonthlyBalanceRec.month)
						yearOpening += transaction.amount;
				}
				else
					break;
			}
		}

		return yearOpening;
	}
	
	var accountSummary = {opening:[],transactions:{},budgets:{},closing:[],difference:[],monthlyBalances:[]};
	
	/* Read Transaction Records of the year */
	for (var i in this.accounts[accountIdx].transactions) {
		var transaction = this.accounts[accountIdx].transactions[i];
		if (transaction.bankDate.getFullYear() == year && !transaction.deleteMark) {
			var tranxCatg = transaction.tranxCatg;
			var tranxSubcatg = transaction.tranxSubcatg;
			var m = transaction.bankDate.getMonth();

			if (!accountSummary.transactions[tranxCatg]) accountSummary.transactions[tranxCatg] = {};
			if (!accountSummary.transactions[tranxCatg][tranxSubcatg]) accountSummary.transactions[tranxCatg][tranxSubcatg] = {};
			if (!accountSummary.transactions[tranxCatg][tranxSubcatg][m]) accountSummary.transactions[tranxCatg][tranxSubcatg][m] = 0;

			accountSummary.transactions[tranxCatg][tranxSubcatg][m] += transaction.amount;
			accountSummary.transactions[tranxCatg][tranxSubcatg][m] = Math.round(accountSummary.transactions[tranxCatg][tranxSubcatg][m]*100)/100;
		}
	}

	/* Read MonthlyBalance Records of the year */
	for (var i in this.accounts[accountIdx].monthlyBalances) {
		var monthlyBalance = this.accounts[accountIdx].monthlyBalances[i];

		if (monthlyBalance.month.getFullYear() == year && !monthlyBalance.deleteMark) {
			var m = monthlyBalance.month.getMonth();
			if (!accountSummary.monthlyBalances[m]) accountSummary.monthlyBalances[m] = {};

			switch (monthlyBalance.type) {
			case 'O':
				accountSummary.opening[m] = monthlyBalance.amount;
				accountSummary.monthlyBalances[m].opening = monthlyBalance;
				break;
			case 'C':
				accountSummary.closing[m] = monthlyBalance.amount;
				accountSummary.monthlyBalances[m].closing = monthlyBalance;
				break;
			}
		}
	}

	/* Calc un-filled opening, closing and difference for all months */
	var currentBalance = findYearOpening(this.accounts[accountIdx], year);
	for (var m=0; m<numMonths; m++) {
		if (!accountSummary.opening[m]) accountSummary.opening[m] = currentBalance;
		else currentBalance = accountSummary.opening[m];
		for (var catg in accountSummary.transactions) {
			for (var subcatg in accountSummary.transactions[catg]) {
				currentBalance += accountSummary.transactions[catg][subcatg][m]||0;
				currentBalance = Math.round(currentBalance*100)/100;
			}
		}

		if (accountSummary.closing[m]) {
			accountSummary.difference[m] = Math.round((accountSummary.closing[m]-currentBalance)*100)/100;
			currentBalance = accountSummary.closing[m];
		}
		else {
			accountSummary.closing[m] = currentBalance;
			accountSummary.difference[m] = 0;
		}
	}
	
	return accountSummary;
};

ExpensesData.prototype.getCardSummary = function(accountIdx, year) {
	var cardSummary = {};
	
	/* Read Transaction Records of the year */
	for (var i in this.accounts[accountIdx].transactions) {
		var transaction = this.accounts[accountIdx].transactions[i];
		if (transaction.bankDate.getFullYear() == year && !transaction.deleteMark && transaction.creditCard) {
			var card = transaction.creditCard;
			
			if (!cardSummary[card]) cardSummary[card] = new Array(12);
			var m = transaction.bankDate.getMonth();

			if (!cardSummary[card][m]) cardSummary[card][m] = 0;
			cardSummary[card][m] += transaction.amount;
			cardSummary[card][m] = Math.round(cardSummary[card][m]*100)/100;
		}
	}

	return cardSummary;
};

ExpensesData.prototype.getTransactionRecs = function(accountIdx, year, month) {
	var transactionRecs = [];
	
	for (var i in this.accounts[accountIdx].transactions) {
		var transaction = this.accounts[accountIdx].transactions[i];
		if (!transaction.deleteMark) {
			if (parseInt(transaction.bankDate.getFullYear()) == year && transaction.bankDate.getMonth() == month) {
				transactionRecs.push(transaction);
			}
		}
	}
	
	transactionRecs.sort(function(a,b) {return a.bankDate - b.bankDate;});
	
	return transactionRecs;
};

ExpensesData.prototype.getIncomeRecs = function(accountIdx, year, month) {
	var incomeRecs = [];
	
	for (var i in this.accounts[accountIdx].transactions) {
		var transaction = this.accounts[accountIdx].transactions[i];
		if (!transaction.deleteMark) {
			if (parseInt(transaction.bankDate.getFullYear()) == year && transaction.bankDate.getMonth() == month && transaction.tranxCatg == 'Incomes') {
				incomeRecs.push(transaction);
			}
		}
	}
	
	incomeRecs.sort(function(a,b) {return a.bankDate - b.bankDate;});
	
	return incomeRecs;
};

ExpensesData.prototype.getExpenditureRecs = function(accountIdx, year, month) {
	var expenditureRecs = [];
	
	for (var i in this.accounts[accountIdx].transactions) {
		var transaction = this.accounts[accountIdx].transactions[i];
		if (!transaction.deleteMark) {
			if (parseInt(transaction.bankDate.getFullYear()) == year && transaction.bankDate.getMonth() == month && transaction.tranxCatg == 'Expenditures') {
				expenditureRecs.push(transaction);
			}
		}
	}
	
	expenditureRecs.sort(function(a,b) {return a.bankDate - b.bankDate;});
	
	return expenditureRecs;
};

ExpensesData.prototype.getShoppingRecs = function(accountIdx, year, month) {
	var shoppingRecs = [];
	
	for (var i in this.accounts[accountIdx].transactions) {
		var shoppingRec = this.accounts[accountIdx].transactions[i];

		if (!shoppingRec.deleteMark) {
			if (parseInt(shoppingRec.bankDate.getFullYear()) == year && shoppingRec.bankDate.getMonth() == month && shoppingRec.tranxCatg == 'Shoppings') {
				shoppingRecs.push(shoppingRec);
			}
		}
	}
	
	shoppingRecs.sort(function(a,b) {return a.shoppingDate - b.shoppingDate;});
	
	return shoppingRecs;
};

ExpensesData.prototype.getInvestmentRecs = function(accountIdx, year, month) {
	var investmentRecs = [];
	
	for (var i in this.accounts[accountIdx].transactions) {
		var transaction = this.accounts[accountIdx].transactions[i];

		if (!transaction.deleteMark) {
			if (parseInt(transaction.bankDate.getFullYear()) == year && transaction.bankDate.getMonth() == month && transaction.tranxCatg == 'Investments') {
				investmentRecs.push(transaction);
			}
		}
	}
	
	investmentRecs.sort(function(a,b) {return a.bankDate - b.bankDate;});
	
	return investmentRecs;
};

ExpensesData.prototype.getTransferRecs = function(accountIdx, year, month) {
	var transferRecs = [];
	
	for (var i in this.accounts[accountIdx].transactions) {
		var transferRec = this.accounts[accountIdx].transactions[i];

		if (!transferRec.deleteMark) {
			if (parseInt(transferRec.bankDate.getFullYear()) == year && transferRec.bankDate.getMonth() == month && transferRec.tranxCatg == 'Transfers') {
				transferRecs.push(transferRec);
			}
		}
	}
	
	transferRecs.sort(function(a,b) {return a.bankDate - b.bankDate;});
	
	return transferRecs;
};

function Asset(category, name) {
	this.name = name||'';
	this.category = category||'';
	this.discontinued = false;
	this.values = [];
}

function AssetValue(asset, date, owner, valueStr, value) {
	this.asset = asset;
	this.owner = owner||'';
	this.date = date||null;
	this.valueStr = valueStr||'';
	this.value = value||0;
}

ExpensesData.prototype.saveAssetValue = function(assetValue) {
	if (!assetValue.id) assetValue.asset.values.push(assetValue);
	BankAccountDao.saveAssetValue(assetValue, function(id) {assetValue.id = id;});
}; 

ExpensesData.prototype.getAssetSummary = function(year, month) {
	var refDate = new Date(year, month, 1);
	
	function AssetEntry(asset) {
		this['Home'] = new AssetValue(asset, refDate, 'Home', '', 0);
		this['Papa'] = new AssetValue(asset, refDate, 'Papa', '', 0);
		this['Mama'] = new AssetValue(asset, refDate, 'Mama', '', 0);
		this['Lok Lok'] = new AssetValue(asset, refDate, 'Lok Lok', '', 0);
		this['Total'] = new AssetValue({}, refDate, 'Total', '', 0);
	}
	
	var assetSummary = {
		owners:new AssetEntry(),
		categories:{},
		assetEntries:{}
	};
	
	/* Run Bank Account Balance as Cash as default Asset */
	for (var accIdx=0; accIdx<this.accounts.length; accIdx++) {
		if (this.accounts[accIdx].assetCategory == 'Cash') {
			var accountSummary = this.getAccountSummary(accIdx, refDate.getFullYear(), 12);
			
			if (!assetSummary.categories[this.accounts[accIdx].assetCategory]) 
				assetSummary.categories[this.accounts[accIdx].assetCategory] = new AssetEntry();
			if (!assetSummary.assetEntries[this.accounts[accIdx].assetCategory])
				assetSummary.assetEntries[this.accounts[accIdx].assetCategory] = {};
			
			if (!assetSummary.assetEntries[this.accounts[accIdx].assetCategory][this.accounts[accIdx].assetName])
				assetSummary.assetEntries[this.accounts[accIdx].assetCategory][this.accounts[accIdx].assetName] = new AssetEntry(new Asset(this.accounts[accIdx].assetCategory,this.accounts[accIdx].assetName));
			
			var assetEntry = assetSummary.assetEntries[this.accounts[accIdx].assetCategory][this.accounts[accIdx].assetName];
			assetEntry[this.accounts[accIdx].owner].value = accountSummary.closing[refDate.getMonth()];

			assetEntry['Total'].value += assetEntry[this.accounts[accIdx].owner].value;
			assetSummary.owners[this.accounts[accIdx].owner].value += assetEntry[this.accounts[accIdx].owner].value;
			assetSummary.owners['Total'].value += assetEntry[this.accounts[accIdx].owner].value;
		}
	}
	
	/* Run the rest Assets */
	for (var i=0; i<this.assets.length; i++) {
		var asset = this.assets[i];
		if (!asset.deleteMark) {
			if (!assetSummary.categories[asset.category]) assetSummary.categories[asset.category] = new AssetEntry();
			
			if (!assetSummary.assetEntries[asset.category]) assetSummary.assetEntries[asset.category] = [];
			
			var assetEntry = new AssetEntry(asset);
			asset.values.sort(function(a,b) {return a.date.valueOf() - b.date.valueOf();});
			for (var j=0; j<asset.values.length; j++) {
				var assetValue = asset.values[j];
				
				if (!assetValue.deleted) {
					if (assetValue.date.valueOf() == refDate.valueOf())
						assetEntry[assetValue.owner] = assetValue;
					else if (assetValue.date.valueOf() < refDate.valueOf()) {
						assetEntry[assetValue.owner].valueStr = assetValue.valueStr;
						assetEntry[assetValue.owner].value = assetValue.value;
					}
				}
			}
			
			for (var owner in assetEntry) {
				if (owner != 'Total')
					assetEntry['Total'].value += assetEntry[owner].value;
				
				assetSummary.owners[owner].value += assetEntry[owner].value;
			}
			
			if (assetEntry['Total'].value > 0 || !asset.discontinued)
				assetSummary.assetEntries[asset.category].push(assetEntry);
		}
	}

	return assetSummary;
};

ExpensesData.prototype.setSelectedAccountIdx = function(accountIdx) {
	this.appState.filters.selectedAccountIdx = accountIdx;
};

ExpensesData.prototype.getSelectedAccountIdx = function() {
	return this.appState.filters.selectedAccountIdx;
};

ExpensesData.prototype.getSelectedAccount = function() {
	return this.accounts[this.appState.filters.selectedAccountIdx];
};

ExpensesData.prototype.setSelectedYear = function(year) {
	this.appState.filters.selectedYear = year;
};

ExpensesData.prototype.getSelectedYear = function() {
	return this.appState.filters.selectedYear;
};

ExpensesData.prototype.setSelectedMonth = function(month) {
	this.appState.filters.selectedMonth = month;
};

ExpensesData.prototype.getSelectedMonth = function() {
	return this.appState.filters.selectedMonth;
};

ExpensesData.prototype.getTranxSubcatgList = function(catg) {
	var subcatgList = [];
	var tempList = [];
	var lastSubcatg;
	
	var transactions = this.accounts[this.appState.filters.selectedAccountIdx].transactions;
	for (var i in transactions) {
		if (!transactions[i].deleteMark && (catg == '' || transactions[i].tranxCatg == catg))
			tempList.push(transactions[i].tranxSubcatg);
	}
	
	tempList.sort();
	lastSubcatg = '';
	for (var i in tempList) {
		if (tempList[i] != lastSubcatg) {
			subcatgList.push(tempList[i]);
			lastSubcatg = tempList[i];
		}
	}
	
	return subcatgList;
};