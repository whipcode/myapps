datastore = {
	data:{},
	selectedYear:0,
	
	init:function() {
		this.data.accounts = new Accounts();
		this.data.closings = new Closings();
		this.data.transactions = new Transactions();
		this.data.assets = new Assets();
		this.data.assetRates = new AssetRates();
		this.data.assetAmounts = new AssetAmounts();
	},
	
	bind:function(model, event, callback, caller) {
		return this.data[model].bind(event, callback, caller);
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
		var _this = this;
		
		ServerApi.saveClosing(closing.toJSON(), {
			callback:function(_data) {
				if (!closing.get('deleted')) {
					closing.set(_data, {silent:true});
					_this.calcClosings();
				}
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
				_this.calcClosings();
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	calcClosings:function() {
		var accountsMonthlyTotal = this.getTotalsByAccountByMonth();
		
		var accounts = this.getAccounts();
		for (var i=0; i<accounts.length; i++) {
			var account = accounts.at(i);
			var opening = this.getClosing(account, this.selectedYear-1, 11);
			
			for (var m=0; m<12; m++) {
				var total = accountsMonthlyTotal[account.get('id')]?accountsMonthlyTotal[account.get('id')][m]:0;
				var closing = this.getClosing(account, this.selectedYear, m);
				if (closing.get('overriden') == false) {
					closing.set({amount:opening.get('amount')+total});
				}
				else {
					closing.set({diff:opening.get('amount')+total-closing.get('amount')});
				}
				opening = closing;
			}
		}
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

				_this.calcClosings();
				
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	getTotalsByAccountByMonth:function() {
		var totalsByAccountByMonth = {};
		var transactions = this.getTransactions();
		for (var i=0; i<transactions.length; i++) {
			var transaction = transactions.at(i);
			var amountsByAccountByMonth = bu.getAmountsByAccountByMonth(transaction);
			
			for (var a in amountsByAccountByMonth) {
				if (!totalsByAccountByMonth[a]) totalsByAccountByMonth[a] = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
				
				for (var m in amountsByAccountByMonth[a])
					totalsByAccountByMonth[a][m] += amountsByAccountByMonth[a][m];
			}
		}
		
		return totalsByAccountByMonth;
	},
	
	getAssetOwners:function() {
		return ['Home','Papa','Mama','Lok Lok'];
	},
	
	getAssetValuesOfMonthByTypeByAssessByOwner:function(month) {
		var assetValues = {};
		
		/* Add Account Assets */
		var closings = this.getClosingsOfMonth(month);
		for (var i=0; i<closings.length; i++) {
			var closing = closings.at(i);
			var account = closing.get('account');
			var assetType = account.assetType;
			var accountName = account.name;
			var accountOwner = account.owner;

			if (assetType && accountOwner) {
				if (!assetValues[assetType]) assetValues[assetType] = {};
				if (!assetValues[assetType][accountName]) assetValues[assetType][accountName] = {asset:new Asset({name:accountName}), rate:new AssetRate({rate:1}), assetAmounts:{}};
				assetValues[assetType][accountName].assetAmounts[accountOwner] = new AssetAmount({amount:closing.get('amount')});
			}
		}
		
		return assetValues;
	}
};