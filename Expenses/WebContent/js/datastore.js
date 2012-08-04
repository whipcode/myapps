datastore = {
	data:{},
	selectedYear:null,
	selectedAccount:null,
	selectedMonth:null,
	
	init:function() {
		this.data.accounts = new Accounts();
		this.data.balances = new Balances();
		this.data.transactions = new Transactions();
		this.data.listedTransactions = new Transactions();
		this.data.accountSummary = this.initAccountSummary();
		this.data.transactionsByMonthByAccount = {};
		this.data.reminders = new Reminders();
	},
	
	/* Accounts */
	loadAccounts:function(cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.loadAccounts({
			callback:function(_data) {
				_this.data.accounts.reset(_data);
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	getAccounts:function() {
		return this.data.accounts;
	},
	
	getAccount:function(i) {
		return this.data.accounts.at(i);
	},
	
	locateAccount:function(account) {
		for (var i=0; i<this.data.accounts.length; i++) {
			if (account instanceof Backbone.Model) {
				if (this.data.accounts.at(i).get('id') == account.get('id'))
					return i;
			}
			else if (account) {
				if (this.data.accounts.at(i).get('id') == account.id)
					return i;
			}
		}
		
		return -1;
	},
	
	saveAccount:function(account, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveAccount(account.toJSON(), {
			callback:function(_data) {
				if (!account.get('id') && !account.get('deleted'))
					_this.data.accounts.add(account);
				else if (account.get('deleted'))
					_this.data.accounts.remove(account);

				if (!account.get('deleted'))
					account.set(_data, {silent:true});
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	/* Balances */
	getBalances:function() {
		return this.data.balances;
	},
	
	/* Transactions */
	initAccountSummary:function() {
		var accountSummary = new Model();
		var openings = new Collection();
		var sections = new Collection();
		var closings = new Collection();
		
		/* Prepare Account Summary Sections */
		var tranTypes = bu.getTranTypes();
		for (var i=0; i<tranTypes.length; i++) {
			var section = new Model();
			section.set({transactions:new Transactions()});
			sections.add(section);
		}
		
		accountSummary.set({openings:openings, sections:sections, closings:closings});
		
		return accountSummary;
	},
	
	loadTransactions:function(year, selectedAccount, selectedMonth, cbSuccess, cbFailed) {
		var _this = this;
		
		this.selectedYear = year;
		this.selectedAccount = selectedAccount;
		this.selectedMonth = selectedMonth;
		
		ServerApi.loadTransactions(this.selectedYear, {
			callback:function (_data) {
				_this.data.transactions.reset(_data);
				_this.resetTransactions();
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	resetTransactions:function() {
		var selectedAccId = this.selectedAccount.get('id');
		var selectedMonth = this.selectedMonth;
		var listedTransactions = [];
		var openings = this.data.accountSummary.get('openings');
		var closings = this.data.accountSummary.get('closings');
		var sections = this.data.accountSummary.get('sections');

		/* Prepare Account Summary Section arrays */
		var tranTypes = bu.getTranTypes();
		var tranxCatg = [];
		for (var i=0; i<tranTypes.length; i++) {
			tranxCatg.push([]);
		}
		
		for (var i=0; i<this.data.transactions.length; i++) {
			var transaction = this.data.transactions.at(i);
			var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
			var tranDateMonth = transaction.get('tranDate')?transaction.get('tranDate').getMonth():-1;
			var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
			var settleDateMonth = transaction.get('settleDate')?transaction.get('settleDate').getMonth():-1;
			var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
			var claimDateMonth = transaction.get('claimDate')?transaction.get('claimDate').getMonth():-1;
			var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
			var transferDateMonth = transaction.get('tranDate')?transaction.get('tranDate').getMonth():-1;
			var investmentAccId = transaction.get('investmentAcc')?transaction.get('investmentAcc').id:0;
			var investmentDateMonth = transaction.get('tranDate')?transaction.get('tranDate').getMonth():-1;

			/* Set Listed Transactions array */
			if ((tranxAccId==selectedAccId && tranDateMonth==selectedMonth) || 
				(settleAccId==selectedAccId  && settleDateMonth==selectedMonth) || 
				(claimAccId==selectedAccId  && claimDateMonth==selectedMonth) || 
				(transferAccId==selectedAccId  && transferDateMonth==selectedMonth) || 
				(investmentAccId==selectedAccId && investmentDateMonth==selectedMonth)
				) {
				listedTransactions.push(transaction);
			}
			
			/* Set Account Summary arrays */
			if (tranxAccId==selectedAccId || settleAccId==selectedAccId || claimAccId==selectedAccId || transferAccId==selectedAccId || investmentAccId==selectedAccId) {
				tranxCatg[transaction.get('tranType')].push(transaction);
			}
			
			/* Set Balance array */
		}

		/* Fill Listed Transactions */
		this.data.listedTransactions.reset(listedTransactions);
		
		/* Fill Account Summary Sections */
		for (var i=0; i<tranTypes.length; i++) {
			sections.at(i).get('transactions').reset(tranxCatg[i]);
		}
		
		/* Fill Balances */
	},
	
	getListedTransactions:function() {
		return this.data.listedTransactions;
	},
	
	getAccountSummary:function() {
		return this.data.accountSummary;
	},
	
	saveTransaction:function(transaction, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveTransaction(transaction.toJSON(), {
			callback:function(_data) {
				if (!transaction.get('id') && !transaction.get('deleted')) {
					if (transaction.get('tranDate').getFullYear() == _this.selectedYear) {
						_this.data.transactions.add(transaction);
						
						if (transaction.get('tranxAcc').id == _this.selectedAccount.get('id')) {
							if (transaction.get('tranDate').getMonth() == _this.selectedMonth) {
								_this.data.listedTransactions.add(transaction);
							}
						}
					}
				}
				else if (transaction.get('deleted'))
					_this.data.transactions.remove(transaction);
				
				if (!transaction.get('deleted'))
					transaction.set(_data, {silent:true});
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	/* Reminders */
	getReminders:function() {
		return this.data.reminders;
	}
};