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
	loadTransactions:function(year, selectedAccount, selectedMonth, cbSuccess, cbFailed) {
		var _this = this;
		
		this.selectedYear = year;
		
		ServerApi.loadTransactions(this.selectedYear, {
			callback:function (_data) {
				_this.data.transactions.reset(_data);
				_this.resetListedTransactions(selectedAccount, selectedMonth);
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	resetListedTransactions:function(selectedAccount, selectedMonth) {
		var listedTransactions = [];
		this.selectedAccount = selectedAccount;
		this.selectedMonth = selectedMonth;

		for (var i=0; i<this.data.transactions.length; i++) {
			listedTransactions.push(this.data.transactions.at(i));
		}
		
		this.data.listedTransactions.reset(listedTransactions);
	},
	
	getTransactions:function() {
		return this.data.transactions;
	},
	
	getListedTransactions:function() {
		return this.data.listedTransactions;
	},
	
	getAccountTransactions:function(account, month) {
		if (!this.data.transactionByMonthByAccount[month])
			this.data.transactionByMonthByAccount[month] = {};
		
		if (!this.data.transactionByMonthByAccount[month][account.get('id')]) {
			this.data.transactionByMonthByAccount[month][account.get('id')] = new Transactions();
		}
		
		return this.data.transactionByMonthByAccount[month][account.get('id')];
	},
	
	getTransaction:function(i) {
		return this.data.transactions.at(i);
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