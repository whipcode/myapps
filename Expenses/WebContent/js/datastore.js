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
	
	set:function(items, values, refDateFields, collection) {
		for (var i=0; i<items.length; i++) {
			var item = items[i];
			var value = values[i];
			
			if (util.isInYear(item, refDateFields, this.selectedYear) && !item.get('deleted')) {
				if (!item.get('id'))
					collection.add(item);
				item.set(value, {silent:true});
			}
			else {
				if (item.get('id'))
					collection.remove(item);
			}
		}
	},
	
	load:function(year, cbSuccess, cbFailed) {
		var _this = this;
		
		this.selectedYear = year;
		ServerApi.load(this.selectedYear, {
			callback:function (_data) {
				_this.data.accounts.reset(_data.accounts);
				_this.data.closings.reset(_data.closings);
				_this.data.transactions.reset(_data.transactions);
				_this.data.assets.reset(_data.assets);
				_this.data.assetRates.reset(_data.assetRates);
				_this.data.assetAmounts.reset(_data.assetAmounts);

				_this.calcAccounts();
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	calcAccounts:function() {
		var transactionsByAccountByMonth = this.getTransactionsOfYearByAccountByMonth(this.selectedYear);
		var closingsByAccountByMonth = this.getClosingsOfYearByAccountByMonth(this.selectedYear);
	},
	
	/* Accounts */
	getAccounts:function() {
		return this.data.accounts;
	},
	
	getAccount:function(id) {
		return this.data.accounts.where({id:id})[0];
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
				if (cbSuccess) cbSuccess(account);
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
	
	getClosingsOfYearByAccountByMonth:function(year) {
		var closingsByAccountByMonth = {};
		
		/* prep transaction accounts */
		var accounts = this.getAccounts();
		for (var i=0; i<account.length; i++) {
			var account = accounts.at(i);
			closingsByAccountByMonth[account.get('id')] = [null,null,null,null,null,null,null,null,null,null,null,null,null];
		}
		
		/* prep closings */
		var closings = this.getClosings();
		for (var i=0; i<closings.length; i++) {
			var closing = closings.at(i);
			var closingYear = closing.get('date').getFullYear();
			var closingMonth = closing.get('date').getMonth();
			
			if (closingYear == year || (closingYear == year-1 && closingMonth == 11))
				closingsByAccountByMonth[closing.get('account').id][(closingYear-year)*12 + closingMonth + 1] = closing;
		}
		
		/* fill missing closings */
		for (var i=0; i<accounts.length; i++) {
			account = accounts.at(i);
			
			for (var j=0; j<13; i++)
				if (!closingsByAccountByMonth[accounts.at(i).get('id')][j])
					closingsByAccountByMonth[accounts.at(i).get('id')][j] = new Closing({
						account:account
					});
		}
		
		return closingsByAccountByMonth;
	},
	
	getClosingOfAccountOfYearOfMonth:function(account, year, month) {
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
				if (cbSuccess) cbSuccess(closing);
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	calcClosings:function() {
		var accountsMonthlyTotal = this.getTotalsByAccountByMonth();
		var closingCount = this.getClosings().length;
		
		var accounts = this.getAccounts();
		for (var i=0; i<accounts.length; i++) {
			var account = accounts.at(i);
			var opening = this.getClosing(account, this.selectedYear-1, 11);
			
			for (var m=0; m<12; m++) {
				var total = accountsMonthlyTotal[account.get('id')]?accountsMonthlyTotal[account.get('id')][m]:0;
				var closing = this.getClosing(account, this.selectedYear, m);
				if (closing.get('overriden') == false) {
					closing.set({amount:opening.get('amount')+total, diff:0});
				}
				else {
					closing.set({diff:opening.get('amount')+total-closing.get('amount')});
				}
				opening = closing;
			}
		}
		
		if (this.getClosings().length != closingCount)
			this.getClosings().trigger('ready');
	},
	
	/* Transactions */
	getTransactions:function() {
		return this.data.transactions;
	},
	
	getTransactionsOfYearByAccountByMonth:function(year) {
		var transactionsByAccountByMonth = {};
		
		/* prep transaction accounts */
		var accounts = this.getAccounts();
		for (var i=0; i<account.length; i++)
			transactionsByAccountByMonth[accounts.at(i).get('id')] = [[],[],[],[],[],[],[],[],[],[],[],[]];
		
		var transactions = this.getTransactions();
		for (var i=0; i<transactions.length; i++) {
			var transaction = transactions.at(i);
			
			if (transaction.get('tranDate').getFullYear() == year)
				transactionsByAccountByMonth[transaction.get('tranxAcc').id][transaction.get('tranDate').getMonth()].push(transaction);
			
			if (transaction.get('settleAcc') && transaction.get('settleDate').getFullYear() == year)
				transactionsByAccountByMonth[transaction.get('settleAcc').id][transaction.get('settleDate').getMonth()].push(transaction);
			
			if (transaction.get('claimAcc') && transaction.get('claimDate').getFullYear() == year)
				transactionsByAccountByMonth[transaction.get('claimAcc').id][transaction.get('claimDate').getMonth()].push(transaction);
		}
		
		return transactionsByAccountByMonth;
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
				
				if (!transaction.get('deleted'))
					transaction.set(_data, {silent:true});

				_this.calcClosings();
				
				if (cbSuccess) cbSuccess(transaction);
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	saveTransactionRepeat:function(transaction, repeatDtl, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveTransactionRepeat(transaction.toJSON(), repeatDtl, {
			callback:function(_data) {
				for (var i=0; i<_data.length; i++) {
					var _transaction = _data[i];
					
					var foundTran = _this.data.transactions.get(_transaction.id);
					if (foundTran) {
						foundTran.set(_transaction);
					}
					else {
						if (util.isInYear(_transaction, ['tranDate','settleDate','claimDate'], _this.selectedYear) && !_transaction.deleted) {
							_this.data.transactions.add(_transaction);
						}
					}
				}
				
				if (cbSuccess) cbSuccess(transaction);
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
	
	/* Asset */
	getAssets:function() {
		return this.data.assets;
	},
	
	getAssetRates:function() {
		return this.data.assetRates;
	},
	
	getAssetRate:function(asset, year, month) {
		for (var i=0; i<this.data.assetRates.length; i++) {
			var assetRate = this.data.assetRates.at(i);
			if (assetRate.get('asset').id == asset.get('id') && assetRate.get('date').getFullYear() == year && assetRate.get('date').getMonth() == month)
				return assetRate;
		}
		
		var assetRate = new AssetRate();
		assetRate.set({asset:asset.toJSON(), date:new Date(year, month, 1), rate:1.00});
		this.data.assetRates.add(assetRate);
		return assetRate;
	},
	
	getAssetAmounts:function() {
		return this.data.assetAmounts;
	},
	
	getAssetAmount:function(assetRate, owner) {
		for (var i=0; i<this.data.assetAmounts.length; i++) {
			var assetAmount = this.data.assetAmounts.at(i);
			if (assetAmount.get('rate').id == assetRate.get('id') && assetAmount.get('assetOwner') == owner) {
				var amount = assetAmount.get('units') * assetRate.get('rate');
				assetAmount.set({amount:amount}, {silent:true});
				return assetAmount;
			}
		}
		
		var assetAmount = new AssetAmount({rate:assetRate.toJSON(), assetOwner:owner, units:0.00, amount:0.00});
		this.data.assetAmounts.add(assetAmount);
		return assetAmount;
	},
	
	saveAsset:function(asset, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveAsset(asset.toJSON(), {
			callback:function(_data) {
				_this.set([asset], [_data], [], _this.data.assets);
				
				if (cbSuccess) cbSuccess(asset);
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	saveAssetRate:function(assetRate, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveAssetRate(assetRate.toJSON(), {
			callback:function(_data) {
				_this.set([assetRate], [_data], ['date'], _this.data.assetRates);
				
				if (cbSuccess) cbSuccess(assetRate);
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	saveAssetAmount:function(assetAmount, cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.saveAssetAmount(assetAmount.toJSON(), {
			callback:function(_data) {
				_this.set([assetAmount], [_data], [], _this.data.assetAmounts);
				
				if (cbSuccess) cbSuccess(assetAmount);
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	}
};