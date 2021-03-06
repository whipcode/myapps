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
	
	bind:function(collection, event, callback, caller) {
		return this.data[collection].bind(event, callback, caller);
	},
	
	query:function(collectionName, options) {
		var resultSet = null;
		var collection = this.data[collectionName];
		
		if (options.preSortFn) {
		}
		
		if (options.groupBy)
			resultSet = {};
		else
			resultSet = [];
		
		for (var i=0; i<collection.length; i++) {
			if (!options.filterFn || options.filterFn(collection.at(i)))
				util.pushResult(resultSet, collection.at(i), options.groupBy);
		}
		
		if (options.postSortFn) {
		}
		
		return resultSet;
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
	
	loadAccounts:function(cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.loadAccounts({
			callback:function(_accounts) {
				_this.data.accounts.reset(_accounts);
				if (cbSuccess) cbSuccess();
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	load:function(year, cbSuccess, cbFailed) {
		var _this = this;
		
		this.selectedYear = year;
		ServerApi.load(this.selectedYear, {
			callback:function (_data) {
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
		
		/* Calculate closings */
		for (var accId in closingsByAccountByMonth) {
			var closingsByMonth = closingsByAccountByMonth[accId];
			var transactionsByMonth = transactionsByAccountByMonth[accId];
			var openingAmount = closingsByMonth[0].get('amount');
			
			for (var m=0; m<12; m++) {
				var closing = closingsByMonth[m+1];
				var closingAmount = openingAmount;
				var transactions = transactionsByMonth[m];
				
				for (var i=0; i<transactions.length; i++)
					closingAmount += bu.getTransactionAmount(transactions[i], accId, m);
				
				if (!closing.get('overriden'))
					closing.set({amount:closingAmount, diff:0});
				else
					closing.set({diff:closing.get('amount') - closingAmount});
				
				openingAmount = closing.get('amount');
			}
		}
		
		this.getClosings().trigger('ready');
	},
	
	/* Accounts */
	getAccounts:function() {
		return this.data.accounts;
	},
	
	getAccountsByAssetType:function() {
		return this.query('accounts', {
			filterFn:function(model) {
				return model.get('assetType') != '';
			},
			groupBy:['assetType']
		});
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
		for (var i=0; i<accounts.length; i++) {
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
			
			for (var j=0; j<13; j++)
				if (!closingsByAccountByMonth[accounts.at(i).get('id')][j]) {
					var closing = new Closing({
						account:account.toJSON(),
						amount:0,
						date:new Date(year, j, 0)
					});
					closingsByAccountByMonth[accounts.at(i).get('id')][j] = closing;
					this.data.closings.add(closing);
				}
		}
		
		return closingsByAccountByMonth;
	},
	
	getClosingsOfYearOfMonthByAssetTypeByAccName:function(year, month) {
		return this.query('closings', {
			filterFn:function(model) {
				return util.get(model, 'date').getFullYear() == year && util.get(model, 'date').getMonth() == month;
			},
			groupBy:['account.assetType', 'account.name']
		});
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
					_this.calcAccounts();
				}
				if (cbSuccess) cbSuccess(closing);
			},
			errorHandler:function(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed(msg);
			}
		});
	},
	
	/* Transactions */
	getTransactions:function() {
		return this.data.transactions;
	},
	
	getTransactionsOfYearOfAccountOfMonth:function(year, accountId, month) {
		return this.query('transactions', {
			filterFn:function(model) {
				var tranxAccId = model.get('tranxAcc')?model.get('tranxAcc').id:0;
				var tranDate = model.get('tranDate');
				var settleAccId = model.get('settleAcc')?model.get('settleAcc').id:0;
				var settleDate = model.get('settleDate')?model.get('settleDate'):tranDate;
				var claimAccId = model.get('claimAcc')?model.get('claimAcc').id:0;
				var claimDate = model.get('claimDate')?model.get('claimDate'):settleDate;
				var transferAccId = model.get('transferAcc')?model.get('transferAcc').id:0;
				var transferDate = tranDate;

				if (tranxAccId == accountId && tranDate.getFullYear() == year && tranDate.getMonth() == month)
					return true;
				if (settleAccId == accountId && settleDate.getFullYear() == year && settleDate.getMonth() == month)
					return true;
				if (claimAccId == accountId && claimDate.getFullYear() == year && claimDate.getMonth() == month)
					return true;
				if (transferAccId == accountId && transferDate.getFullYear() == year && transferDate.getMonth() == month)
					return true;
				if (claimAccId && settleAccId == accountId && claimDate.getFullYear() == year && claimDate.getMonth() == month)
					return true;
				if (claimAccId && !settleAccId && tranxAccId == accountId && claimDate.getFullYear() == year && claimDate.getMonth() == month)
					return true;
				
				return false;
			}
		});
	},
	
	getTransactionsOfYearByAccountByMonth:function(year) {
		var transactionsByAccountByMonth = {};
		
		/* prep transaction accounts */
		var accounts = this.getAccounts();
		for (var i=0; i<accounts.length; i++)
			transactionsByAccountByMonth[accounts.at(i).get('id')] = [[],[],[],[],[],[],[],[],[],[],[],[]];
		
		var transactions = this.getTransactions();
		for (var i=0; i<transactions.length; i++) {
			var transaction = transactions.at(i);
			var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
			var tranDate = transaction.get('tranDate');
			var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
			var settleDate = transaction.get('settleDate')?transaction.get('settleDate'):tranDate;
			var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
			var claimDate = transaction.get('claimDate')?transaction.get('claimDate'):settleDate;
			var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
			var transferDate = tranDate;
			
			if (tranDate.getFullYear() == year)
				transactionsByAccountByMonth[tranxAccId][tranDate.getMonth()].push(transaction);
			
			if (settleAccId && settleDate.getFullYear() == year)
				transactionsByAccountByMonth[settleAccId][settleDate.getMonth()].push(transaction);
			
			if (claimAccId && claimDate.getFullYear() == year) {
				transactionsByAccountByMonth[claimAccId][claimDate.getMonth()].push(transaction);
				
				if (settleAccId && settleDate.getMonth() != claimDate.getMonth())
					transactionsByAccountByMonth[settleAccId][claimDate.getMonth()].push(transaction);
				else if (tranDate.getMonth() != claimDate.getMonth())
					transactionsByAccountByMonth[tranxAccId][claimDate.getMonth()].push(transaction);
			}
			
			if (transferAccId && transferDate.getFullYear() == year)
				transactionsByAccountByMonth[transferAccId][transferDate.getMonth()].push(transaction);
		}
		
		return transactionsByAccountByMonth;
	},
	
	getTransactionsOfYearOfAccountByTranTypeByTranxCatg:function(year, accountId) {
		return this.query('transactions', {
			filterFn:function(model) {
				var tranxAccId = model.get('tranxAcc')?model.get('tranxAcc').id:0;
				var tranDate = model.get('tranDate');
				var settleAccId = model.get('settleAcc')?model.get('settleAcc').id:0;
				var settleDate = model.get('settleDate')?model.get('settleDate'):tranDate;
				var claimAccId = model.get('claimAcc')?model.get('claimAcc').id:0;
				var claimDate = model.get('claimDate')?model.get('claimDate'):settleDate;
				var transferAccId = model.get('transferAcc')?model.get('transferAcc').id:0;
				var transferDate = tranDate;

				if (tranxAccId == accountId && tranDate.getFullYear() == year)
					return true;
				if (settleAccId == accountId && settleDate.getFullYear() == year)
					return true;
				if (claimAccId == accountId && claimDate.getFullYear() == year)
					return true;
				if (transferAccId == accountId && transferDate.getFullYear() == year)
					return true;
				if (claimAccId && settleAccId == accountId && claimDate.getFullYear() == year)
					return true;
				if (claimAccId && !settleAccId && tranxAccId == accountId && claimDate.getFullYear() == year)
					return true;
				return false;
			},
			groupBy:['tranType', 'tranxCatg']
		});
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

				_this.calcAccounts();
				
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
	
	getAssetsByAssetType:function(year, month) {
		return this.query('assets', {
			groupBy:['type']
		});
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
	
	getAssetAmountsOfYearOfMonth:function(asset, year, month) {
		var assetAmounts = [];
		
		var assetAmountsByOwner = this.query('assetAmounts', {
			filterFn:function(model) {
				return model.get('asset').id == util.get(asset, 'id') && model.get('date').getFullYear() == year && model.get('date').getMonth() == month;
			},
			groupBy:['asset.assetOwner']
		});
		
		var owners = bu.getAssetOwners();
		for (var i=0; i<owners.length; i++) {
			if (assetAmountsByOwner[owners[i]])
				assetAmounts.push(assetAmountsByOwner[owners[i]]);
			else
				assetAmounts.push(new AssetAmount({asset:asset}));
		}
		
		return assetAmounts;
	},
	
	getAssetAmountsOfYearOfMonthByAsset:function(year, month) {
		return this.query('assets', {
			filterFn:function(model) {
				return model.get('date').getFullYear() == year && model.get('date').getMonth() == month;
			},
			groupBy:['assetRate.asset.name']
		});
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