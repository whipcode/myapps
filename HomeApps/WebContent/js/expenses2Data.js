function Account() {
	this.accName = '';
	this.assetCategory = '';
	this.assetName = '';
	this.monthlyBalances = [];
	this.transactions = [];
	this.budgets = [];
}

function Balance(account, month, type, amount, remarks) {
	this.month = month||null;
	this.type = type||'';
	this.amount = amount||0;
	this.remarks = remarks||'';
	this.account = account||null;
}
Balance.TYPE = {OPENING:'O',CLOSING:'C'};

function Transaction(account, amount, bankDate, desc, tranxCatg, tranxSubcatg, remarks, repeatKey, creditCard, remind, reminderMsg, remindDate) {
	this.bankDate = bankDate||null;
	this.desc = desc||'';
	this.tranxCatg = tranxCatg||'';
	this.tranxSubcatg = tranxSubcatg||'';
	this.amount = amount||0;
	this.remarks = remarks||'';
	this.creditCard = creditCard||'';
	this.remind = remind||false;
	this.reminderMsg = reminderMsg||'';
	this.remindDate = remindDate||null;
	this.repeatKey = repeatKey||(new Date()).valueOf();
	this.account = account||null;
}
Transaction.CATG = {INCOME:'Incomes',EXPENDITURE:'Expenditures',SHOPPING:'Shoppings',INVESTMENT:'Investments',TRANSFER:'Transfers'};

function RepeatDtl() {
	this.everyN = 1;
	this.repeatN = 1;
}

function Dao() {
	this.accounts = [];
	this.assets = [];
	this.settings = {
		monthLabels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		monthIdx:{jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11}
	};

	dwr.engine.setAsync(false);
}

Dao.prototype.saveAccount = function(account) {
	BankAccountDao.saveAccount(this.mold(account,2), function(_account) {wui.objUtil.copyObjValues(account, _account);});
};

Dao.prototype.deleteAccount = function(account) {
	account.deleteMark = true;
	BankAccountDao.saveAccount(account);
};

Dao.prototype.saveMonthlyBalance = function(monthlyBalance) {
	BankAccountDao.saveMonthlyBalance(this.mold(monthlyBalance,2), 
		function(_monthlyBalance) {
			if (!monthlyBalance.id)
				monthlyBalance.account.monthlyBalances.push(monthlyBalance);
			
			wui.objUtil.copyObjValues(monthlyBalance, _monthlyBalance); 
		});
};

Dao.prototype.deleteMonthlyBalance = function(monthlyBalance) {
	monthlyBalance.deleteMark = true;
	BankAccountDao.saveMonthlyBalance(monthlyBalance);
};

Dao.prototype.saveTransaction = function(transaction) {
	BankAccountDao.saveTransaction(this.mold(transaction,2), 
		function(_transaction) {
			if (!transaction.id)
				transaction.account.transactions.push(transaction);
			
			wui.objUtil.copyObjValues(transaction, _transaction); 
		});
};

Dao.prototype.saveTransactions = function(transaction, repeatDtl) {
	var transactions = [transaction];
	
	if (repeatDtl) {
		for (var i=1; i<repeatDtl.repeatN; i++) {
			var targetDate = new Date(transaction.bankDate.toDateString());
			targetDate.setMonth(targetDate.getMonth() + repeatDtl.everyN*i);
			
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
				foundTranx.remind = transaction.remind;
				foundTranx.reminderMsg = transaction.reminderMsg;
				foundTranx.remindDate = transaction.remindDate;
				transactions.push(foundTranx);
			}
			else {
				var newTranx = new Transaction(transaction.account,transaction.amount,targetDate,transaction.desc,transaction.tranxCatg,transaction.tranxSubcatg,transaction.remarks,transaction.repeatKey,transaction.creditCard,transaction.remind,transaction.reminderMsg,transaction.remindDate);
				transactions.push(newTranx);
			}
		}
	}
	
	BankAccountDao.saveTransactionRepeat(this.mold(transactions,3), 
		function(_transactions) {
			for (var i=0;i<transactions.length;i++) {
				if (!transactions[i].id)
					transactions[i].account.transactions.push(transactions[i]);
				
				wui.objUtil.copyObjValues(transactions[i], _transactions[i]);
			}
		});
};

Dao.prototype.saveTransactionsRepeatAuto = function(transaction) {
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
			t.remind = transaction.remind;
			t.reminderMsg = transaction.reminderMsg;
			t.remindDate = transaction.remindDate;
			transactions.push(t);
		}
	}
	
	BankAccountDao.saveTransactionRepeat(this.mold(transactions,3), 
		function(_transactions) {
			for (var i=0;i<transactions.length;i++) {
				if (!transactions[i].id)
					transactions[i].account.transactions.push(transactions[i]);
				
				wui.objUtil.copyObjValues(transactions[i], _transactions[i]);
			}
		});
};

Dao.prototype.deleteTransaction = function(transaction) {
	transaction.deleteMark = true;
	BankAccountDao.saveTransaction(this.mold(transaction,2));
};

Dao.prototype.saveAsset = function(asset) {
	var _this = this;
	BankAccountDao.saveAsset(this.mold(asset,2), 
		function(_asset) {
			if (!asset.id)
				_this.assets.push(asset);

			wui.objUtil.copyObjValues(asset, _asset);
		}
	);
};

Dao.prototype.load = function() {
	var _this = this;
	
	BankAccountDao.getAssets(function(assets) {_this.assets = assets;});
	BankAccountDao.getAccounts(function(accounts) {_this.accounts = accounts;});
};

Dao.prototype.getAccounts = function() {
	return this.accounts;
};

Dao.prototype.getAccountList = function() {
	var accountList = [];

	for (var a in this.accounts) {
		if (!this.accounts[a].deleteMark)
			accountList.push(this.accounts[a].accName);
	}
	
	return accountList;
};

Dao.prototype.getAccountSummary = function(account, year) {
	var accountSummary = {opening:[],transactions:{},budgets:{},closing:[],difference:[],monthlyBalances:[]};
	var numMonths = 12;

	function findYearOpening(account, year) {
		var yearOpening = 0;
		var refDate= new Date(year, 0, 1);
		var lastMonthlyBalance = null;
		
		for (var i=0; i<account.monthlyBalances.length; i++) {
			var monthlyBalance = account.monthlyBalances[i];
			
			if (!monthlyBalance.deleteMark) {
				if (monthlyBalance.month.valueOf() < refDate.valueOf()) {
					if (!lastMonthlyBalance || monthlyBalance.month.valueOf() > lastMonthlyBalance.month.valueOf() || (monthlyBalance.month.valueOf() == lastMonthlyBalance.month.valueOf() && monthlyBalance.type == Balance.TYPE.CLOSING))
						lastMonthlyBalance = account.monthlyBalances[i];
				}
				else
					break;
			}
		}
		
		if (lastMonthlyBalance) {
			yearOpening = lastMonthlyBalance.amount;
			if (lastMonthlyBalance.type == Balance.TYPE.CLOSING)
				refDate = new Date(lastMonthlyBalance.month.getFullYear(), lastMonthlyBalance.month.getMonth()+1, 1);
			else
				refDate = lastMonthlyBalance.month;
		}
		else
			refDate = null;
		
		for (var i in account.transactions) {
			var transaction = account.transactions[i];
			
			if (!transaction.deleteMark) {
				if (transaction.bankDate.getFullYear() < year) {
					if (!refDate || transaction.bankDate.valueOf() >= refDate.valueOf())
						yearOpening += transaction.amount;
				}
				else
					break;
			}
		}

		return yearOpening;
	}
	
	/* Read Transaction Records of the year */
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
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
	for (var i in account.monthlyBalances) {
		var monthlyBalance = account.monthlyBalances[i];

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
	var currentBalance = findYearOpening(account, year);
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

Dao.prototype.getCardSummary = function(accountIdx, year) {
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

Dao.prototype.compTransaction = function(t1, t2) {
	if (t1.bankDate.valueOf() == t2.bankDate.valueOf() && t1.id && t2.id)
		return t1.id - t2.id;
	return t1.bankDate - t2.bankDate;
};

Dao.prototype.getTransactionRecs = function(account, year, month, catg) {
	var transactionRecs = [];
	
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
		if (!transaction.deleteMark) {
			if (parseInt(transaction.bankDate.getFullYear()) == year && transaction.bankDate.getMonth() == month && (!catg || transaction.tranxCatg == catg)) {
				transactionRecs.push(transaction);
			}
		}
	}
	
	transactionRecs.sort(this.compTransaction);
	
	return transactionRecs;
};

Dao.prototype.getReminders = function(account, year, month) {
	var transactionRecs = [];
	
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
		if (!transaction.deleteMark) {
			if (parseInt(transaction.bankDate.getFullYear()) == year && transaction.bankDate.getMonth() == month && transaction.reminderMsg) {
				transactionRecs.push(transaction);
			}
		}
	}
	
	transactionRecs.sort(this.compTransaction);
	
	return transactionRecs;
};

Dao.prototype.getIncomeRecs = function(accountIdx, year, month) {
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

Dao.prototype.getExpenditureRecs = function(accountIdx, year, month) {
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

Dao.prototype.getShoppingRecs = function(accountIdx, year, month) {
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

Dao.prototype.getInvestmentRecs = function(accountIdx, year, month) {
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

Dao.prototype.getTransferRecs = function(accountIdx, year, month) {
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

Dao.prototype.saveAssetValue = function(assetValue) {
	if (!assetValue.id) assetValue.asset.values.push(assetValue);
	
	BankAccountDao.saveAssetValue(this.mold(assetValue, 2), 
		function(_assetValue) {
			wui.objUtil.copyObjValues(assetValue, _assetValue);
		});
}; 

Dao.prototype.getAssetSummary = function(year, month) {
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
			var accountSummary = this.getAccountSummary(this.accounts[accIdx], refDate.getFullYear(), 12);
			
			if (!assetSummary.categories[this.accounts[accIdx].assetCategory]) 
				assetSummary.categories[this.accounts[accIdx].assetCategory] = new AssetEntry();
			if (!assetSummary.assetEntries[this.accounts[accIdx].assetCategory])
				assetSummary.assetEntries[this.accounts[accIdx].assetCategory] = {};
			
			if (!assetSummary.assetEntries[this.accounts[accIdx].assetCategory][this.accounts[accIdx].assetName])
				assetSummary.assetEntries[this.accounts[accIdx].assetCategory][this.accounts[accIdx].assetName] = new AssetEntry(new Asset(this.accounts[accIdx].assetCategory,this.accounts[accIdx].assetName));
			
			var assetEntry = assetSummary.assetEntries[this.accounts[accIdx].assetCategory][this.accounts[accIdx].assetName];
			assetEntry[this.accounts[accIdx].owner].value = accountSummary.closing[refDate.getMonth()];

			assetEntry['Total'].value += assetEntry[this.accounts[accIdx].owner].value;
			assetSummary.categories[this.accounts[accIdx].assetCategory][this.accounts[accIdx].owner].value += assetEntry[this.accounts[accIdx].owner].value;
			assetSummary.owners[this.accounts[accIdx].owner].value += assetEntry[this.accounts[accIdx].owner].value;
			assetSummary.categories[this.accounts[accIdx].assetCategory]['Total'].value += assetEntry[this.accounts[accIdx].owner].value;
			assetSummary.owners['Total'].value += assetEntry[this.accounts[accIdx].owner].value;
		}
	}
	
	/* Run the rest Assets */
	for (var i=0; i<this.assets.length; i++) {
		var asset = this.assets[i];
		if (!asset.deleteMark) {
			if (!assetSummary.categories[asset.category]) assetSummary.categories[asset.category] = new AssetEntry();
			
			if (!assetSummary.assetEntries[asset.category]) assetSummary.assetEntries[asset.category] = {};
			
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
				assetSummary.categories[asset.category][owner].value += assetEntry[owner].value;
			}
			
			if (assetEntry['Total'].value > 0 || !asset.discontinued)
				assetSummary.assetEntries[asset.category][asset.name] = assetEntry;
		}
	}

	return assetSummary;
};

Dao.prototype.setSelectedAccountIdx = function(accountIdx) {
	this.appState.filters.selectedAccountIdx = accountIdx;
};

Dao.prototype.getSelectedAccountIdx = function() {
	return this.appState.filters.selectedAccountIdx;
};

Dao.prototype.getSelectedAccount = function() {
	return this.accounts[this.appState.filters.selectedAccountIdx];
};

Dao.prototype.setSelectedYear = function(year) {
	this.appState.filters.selectedYear = year;
};

Dao.prototype.getSelectedYear = function() {
	return this.appState.filters.selectedYear;
};

Dao.prototype.setSelectedMonth = function(month) {
	this.appState.filters.selectedMonth = month;
};

Dao.prototype.getSelectedMonth = function() {
	return this.appState.filters.selectedMonth;
};

Dao.prototype.getTranxSubcatgList = function(catg) {
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

Dao.prototype.format = function(data, format) {
	var rtn = null;
	
	switch (typeof data) {
	case 'object':
		if (!data)
			rtn = '';
		else if (data instanceof Date)
			rtn = data.getDate() + ' ' + this.settings.monthLabels[data.getMonth()].toUpperCase() + ' ' + data.getFullYear();
		else
			rtn = data;
		break;
	case 'number':
		if (data == 0)
			rtn = '0.00';
		else if (Math.abs(data) < 1) {
			if (data < 0) {
				rtn = Math.round((data-1)*100)+'';
				var regexp = /(\d+)(\d{2})/;
				rtn = rtn.replace(regexp,'0.$2');
			}
			else {
				rtn = Math.round((data+1)*100)+'';
				var regexp = /(\d+)(\d{2})/;
				rtn = rtn.replace(regexp,'0.$2');
			}
		}
		else
		{
			rtn = Math.round(data*100)+'';
			var regexp = /(\d+)(\d{2})/;
			rtn = rtn.replace(regexp,'$1.$2');

			var regexp = /(\d+)(\d{3})/;
			while (regexp.test(rtn))
				rtn = rtn.replace(regexp,'$1,$2');
		}
		break;
	default:
		rtn = data;
	}
	
	return rtn;
};

Dao.prototype.parseString = function(obj, string) {
	var rtn;
	
	switch (typeof obj) {
	case 'object':
		if (obj instanceof Date) {
			if (string) {
				/* dd mmm yyyy */
				var s = string.split(' ');
				obj.setDate(s[0]);
				if (parseInt(s[1]) > 0)
					obj.setMonth(parseInt(s[1])-1);
				else
					obj.setMonth(this.settings.monthIdx[s[1].toLowerCase()]);
				obj.setFullYear(s[2]);
				
				rtn = obj;
			}
			else
				rtn = null;
		} else 
			rtn = string;
		break;
	case 'number':
		rtn = Number(string.replace(/,/g,''));
		break;
	case 'boolean':
		rtn = (string == 'true' || string == 'yes');
		break;
	case 'string':
		rtn = string;
		break;
	default:
		alert('wui.parseString: undefined parser for obj type "' + typeof obj +'"');
	}
	
	return rtn;
};

Dao.prototype.getAccountTranxCatgs = function(account) {
	var tranxCatgs = {};
	
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
		if (!transaction.deleteMark) {
			if (!tranxCatgs[transaction.tranxCatg])
				tranxCatgs[transaction.tranxCatg] = transaction.tranxCatg;
		}
	}
	
	return tranxCatgs;
};

Dao.prototype.getAccountTranxSubcatgs = function(account) {
	var tranxSubcatgs = {};
	
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
		if (!transaction.deleteMark) {
			if (!tranxSubcatgs[transaction.tranxSubcatg])
				tranxSubcatgs[transaction.tranxSubcatg] = transaction.tranxSubcatg;
		}
	}
	
	return tranxSubcatgs;
};

Dao.prototype.getAccountCards = function(account) {
	var cards = {};
	
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
		if (!transaction.deleteMark && transaction.creditCard) {
			if (!cards[transaction.creditCard])
				cards[transaction.creditCard] = transaction.creditCard;
		}
	}
	
	return cards;
};

Dao.prototype.mold = function(obj, levels) {
	var crone = obj;
	
	if (levels == 0)
		return null;
	
	if (obj instanceof Array)
		crone = [];
	else
		crone = {};
	
	for (var a in obj) {
		if (typeof obj[a] == 'object' && obj[a]) {
			if (obj[a] instanceof Array)
				crone[a] = null;
			else {
				if (obj[a] instanceof Date)
					crone[a] = obj[a];
				else
					crone[a] = this.mold(obj[a], levels-1);
			}
		}
		else
			crone[a] = obj[a];
	}
	
	return crone;
};

Dao.prototype.getCardSummary = function(account, year, month) {
	var cardSummary = {};
	
	for (var i in account.transactions) {
		var transaction = account.transactions[i];
		if (transaction.bankDate.getFullYear() == year && transaction.bankDate.getMonth() == month && !transaction.deleteMark && transaction.creditCard) {
			var card = transaction.creditCard;
			
			if (!cardSummary[card]) cardSummary[card] = {total:0,transactions:[]};
			
			cardSummary[card].transactions.push(transaction);
			cardSummary[card].total += transaction.amount;
		}
	}

	return cardSummary;
};

var dao = new Dao();

