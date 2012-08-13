datastore = {
	data:{},
	selectedYear:0,
	
	init:function() {
		this.data.owners = new Collections();
		this.data.accounts = new Accounts();
		this.data.closings = new Closings();
		this.data.transactions = new Transactions();
		this.data.reminders = new Reminders();
	},
	
	/* Owners */
	getOwners:function() {
		if (this.data.owners.length == 0) {
			this.data.owners.reset([{name:'Home'}, {name:'Papa'}, {name:'Mama'}, {name:'Lok Lok'}]);
		}
		
		return this.data.owners;
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
	
	/* Closings */
	getClosings:function() {
		return this.data.closings;
	},
	
	getClosing:function(account, year, month) {
		for (var i=0; i<this.data.closings.length; i++) {
			var closing = this.data.closings.at(i);
			if (closing.get('account').id == account.get('id') && closing.get('date').getFullYear() == year && closing.get('date').getMonth() == month)
				return closing;
		}
		
		var closing = new Closing();
		closing.set({account:account.toJSON(), date:new Date(year, month+1, 0), amount:0, overriden:false});
		this.data.closings.add(closing);
		return closing;
	},
	
	saveClosing:function(closing, cbSuccess, cbFailed) {
		ServerApi.saveClosing(closing.toJSON(), {
			callback:function(_data) {
				if (!closing.get('deleted'))
					closing.set(_data, {silent:true});
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	/* Transactions */
	loadTransactions:function(year, cbSuccess, cbFailed) {
		var _this = this;
		
		this.selectedYear = year;
		ServerApi.loadTransactions(this.selectedYear, {
			callback:function (_data) {
				_this.data.closings.reset(_data.closings);
				_this.data.transactions.reset(_data.transactions);
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	getTransactions:function() {
		return this.data.transactions;
	},
	
	saveTransaction:function(transaction, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveTransaction(transaction.toJSON(), {
			callback:function(_data) {
				if (!transaction.get('id') && !transaction.get('deleted')) {
					if (bu.isSelectedYear(transaction, _this.selectedYear)) {
						_this.data.transactions.add(transaction);
					}
				}
				else if (transaction.get('id') && transaction.get('deleted'))
					_this.data.transactions.remove(transaction);
				else if (transaction.get('id') && !transaction.get('deleted'))
					_this.data.transactions.trigger('reset');
				
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