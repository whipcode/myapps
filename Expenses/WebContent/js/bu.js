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
	
	isSelectedMonthAccount:function(transaction, selectedAccount, selectedMonth) {
		var selectedAccId = selectedAccount.get('id');
		
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
	}
};