bu = {
	businessCodes:{},
	
	TRANTYPE:{
		EXPENDITURE:0,
		INCOME:1,
		INVESTMENT:2,
		TRANSFER:3
	},
	
	init:function(cbSuccess, cbFailed) {
		var _this = this;
		
		ServerApi.loadBusinessCodes(
			function /*success*/(_data) {
				_this.businessCodes.accTypes = _data.accTypes;
				_this.businessCodes.tranTypes = _data.tranTypes;
				
				if (cbSuccess) cbSuccess();
			},
			function /*failed*/(msg) {
				util.showError(msg);
				if (cbFailed) cbFailed();
			}
		);
	},
	
	getAccTypes:function() {
		return this.businessCodes.accTypes;
	},
	
	getTranTypes:function() {
		return this.businessCodes.tranTypes;
	},
	
	getTranType:function(idx) {
		return this.businessCodes.tranTypes[idx];
	},
	
	isSelectedYear:function(transaction, selectedYear) {
		var tranDateYear = transaction.get('tranDate')?transaction.get('tranDate').getFullYear():-1;
		var settleDateYear = transaction.get('settleDate')?transaction.get('settleDate').getFullYear():-1;
		var claimDateYear = transaction.get('claimDate')?transaction.get('claimDate').getFullYear():-1;
		var transferDateYear = transaction.get('tranDate')?transaction.get('tranDate').getFullYear():-1;
		var investmentDateYear = transaction.get('tranDate')?transaction.get('tranDate').getFullYear():-1;
		
		return (
			tranDateYear==selectedYear ||
			settleDateYear==selectedYear ||
			claimDateYear==selectedYear ||
			transferDateYear==selectedYear ||
			investmentDateYear==selectedYear
			);
	},
	
	isSelectedAccount:function(transaction, selectedAccount) {
		var selectedAccId = selectedAccount.get('id');
		
		var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
		var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
		var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
		var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
		var investmentAccId = transaction.get('investmentAcc')?transaction.get('investmentAcc').id:0;
		
		return ((tranxAccId && tranxAccId==selectedAccId) ||
		(settleAccId && settleAccId==selectedAccId) ||
		(claimAccId && claimAccId==selectedAccId) ||
		(transferAccId && transferAccId==selectedAccId) ||
		(investmentAccId && investmentAccId==selectedAccId)
		);
	},
	
	isSelectedMonthAccount:function(transaction, selectedAccId, selectedMonth) {
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
		
		return ((tranxAccId && tranxAccId==selectedAccId && tranDateMonth==selectedMonth) ||
		(settleAccId && settleAccId==selectedAccId && settleDateMonth==selectedMonth) ||
		(claimAccId && claimAccId==selectedAccId && claimDateMonth==selectedMonth) ||
		(transferAccId && transferAccId==selectedAccId && transferDateMonth==selectedMonth) ||
		(investmentAccId && investmentAccId==selectedAccId && investmentDateMonth==selectedMonth)
		);
	},
	
	getFaceTransactions:function(transaction, accId, year, month) {
		var faceTransactions = [];
		
		var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
		var tranDate = transaction.get('tranDate');
		var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
		var settleDate = transaction.get('settleDate')?transaction.get('settleDate'):tranDate;
		var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
		var claimDate = transaction.get('claimDate')?transaction.get('claimDate'):settleDate;
		var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
		var transferDate = tranDate;
		
		if (tranxAccId == accId && tranDate.getFullYear() == year && (tranDate.getMonth() == month || typeof(month) == 'undefined'))
			faceTransactions.push({date:tranDate, desc:transaction.get('desc'), amount:transaction.get('amount')});
		if (settleAccId == accId && settleDate.getFullYear() == year && (settleDate.getMonth() == month || typeof(month) == 'undefined'))
			faceTransactions.push({date:settleDate, desc:transaction.get('desc'), amount:transaction.get('amount')});
		if (claimAccId == accId && claimDate.getFullYear() == year && (claimDate.getMonth() == month || typeof(month) == 'undefined'))
			faceTransactions.push({date:claimDate, desc:transaction.get('desc'), amount:transaction.get('amount')});
		if (transferAccId == accId && transferDate.getFullYear() == year && (transferDate.getMonth() == month || typeof(month) == 'undefined'))
			faceTransactions.push({date:transferDate, desc:transaction.get('desc'), amount:-transaction.get('amount')});
		if (claimAccId && settleAccId == accId && claimDate.getFullYear() == year && (claimDate.getMonth() == month || typeof(month) == 'undefined'))
			faceTransactions.push({date:claimDate, desc:transaction.get('desc'), amount:-transaction.get('amount'), transaction:transaction});
		if (claimAccId && !settleAccId && tranxAccId == accId && claimDate.getFullYear() == year && (claimDate.getMonth() == month || typeof(month) == 'undefined'))
			faceTransactions.push({date:claimDate, desc:transaction.get('desc'), amount:-transaction.get('amount')});
		
		return faceTransactions;
	},
	
	getTransactionAmount:function(transaction, accId, month) {
		var _amount = 0;
		var amount = transaction.get('amount');
		var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
		var tranMonth = transaction.get('tranDate').getMonth();
		var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
		var settleMonth = transaction.get('settleDate')?transaction.get('settleDate').getMonth():tranMonth;
		var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
		var claimMonth = transaction.get('claimDate')?transaction.get('claimDate').getMonth():settleMonth;
		var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
		var transferMonth = tranMonth;
		
		accId = parseInt(accId);
		if (accId == tranxAccId && tranMonth == month)
			_amount = amount;
		else if (accId == settleAccId && settleMonth == month)
			_amount = amount;
		else if (accId == claimAccId && claimMonth == month)
			_amount = amount;
		else if (accId == transferAccId && transferMonth == month)
			_amount = -amount;
		
		if (claimAccId && month == claimMonth) {
			if (accId == settleAccId || (accId == tranxAccId && !settleAccId))
				_amount -= amount;
		}

		return _amount;
	},
	
	getAmountsByAccountByMonth:function(transaction) {
		var amountsByAccountByMonth = {};
		
		var amount = transaction.get('amount');
		var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
		var tranDateMonth = transaction.get('tranDate').getMonth();
		var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
		var settleDateMonth = transaction.get('settleDate')?transaction.get('settleDate').getMonth():tranDateMonth;
		var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
		var claimDateMonth = transaction.get('claimDate')?transaction.get('claimDate').getMonth():settleDateMonth;
		var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
		var transferDateMonth = tranDateMonth;

		/* step 1 - tranxAcc */
		amountsByAccountByMonth[tranxAccId] = {};
		amountsByAccountByMonth[tranxAccId][tranDateMonth] = amount;
		
		/* step 2 - settleAcc */
		if (settleAccId) {
			amountsByAccountByMonth[settleAccId] = {};
			amountsByAccountByMonth[settleAccId][settleDateMonth] = amount;
		}
		
		/* step 3 - settleAcc */
		if (claimAccId) {
			amountsByAccountByMonth[claimAccId] = {};
			amountsByAccountByMonth[claimAccId][claimDateMonth] = amount;
			
			if (settleAccId) {
				if (claimDateMonth == settleDateMonth)
					amountsByAccountByMonth[settleAccId][settleDateMonth] = 0;
				else
					amountsByAccountByMonth[settleAccId][claimDateMonth] = -amount;
			}
			else {
				if (tranDateMonth == settleDateMonth)
					amountsByAccountByMonth[tranxAccId][tranDateMonth] = 0;
				else
					amountsByAccountByMonth[settleAccId][claimDateMonth] = -amount;
			}
		}
		
		/* step 4 - transferAcc */
		if (transferAccId) {
			amountsByAccountByMonth[transferAccId] = {};
			amountsByAccountByMonth[transferAccId][transferDateMonth] = -amount;
		}

		return amountsByAccountByMonth;
	},
	
	getSelectedAccountTranDate:function(transaction, selectedAccount) {
		var selectedAccId = selectedAccount.get('id');
		var tranxAccId = transaction.get('tranxAcc')?transaction.get('tranxAcc').id:0;
		var settleAccId = transaction.get('settleAcc')?transaction.get('settleAcc').id:0;
		var claimAccId = transaction.get('claimAcc')?transaction.get('claimAcc').id:0;
		var transferAccId = transaction.get('transferAcc')?transaction.get('transferAcc').id:0;
		var investmentAccId = transaction.get('investmentAcc')?transaction.get('investmentAcc').id:0;
		
		if (tranxAccId == selectedAccId) return transaction.get('tranDate');
		else if (settleAccId == selectedAccId) return transaction.get('settleDate');
		else if (claimAccId == selectedAccId) return transaction.get('claimDate');
		else if (transferAccId == selectedAccId) return transaction.get('transferDate');
		else if (investmentAccId == selectedAccId) return transaction.get('investmentDate');
	},
	
	getTranDateOfSelectedAcc:function(transaction, selectedAccId) {
		var tranxAcc = util.get(transaction, 'tranxAcc');
		var settleAcc = util.get(transaction, 'settleAcc');
		var claimAcc = util.get(transaction, 'claimAcc');
		
		if (util.get(tranxAcc, 'id') == selectedAccId)
			return util.get(transaction, 'tranDate');
		else if (util.get(settleAcc, 'id') == selectedAccId)
			return util.get(transaction, 'settleDate');
		else if (util.get(claimAcc, 'id') == selectedAccId)
			return util.get(transaction, 'claimDate');
		
		return null;
	},
	
	getAssetOwners:function() {
		return ['Home', 'Papa', 'Mama', 'Lok Lok'];
	},
	
	getOwnerBlanks:function() {
		return {'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00};
	}
};
