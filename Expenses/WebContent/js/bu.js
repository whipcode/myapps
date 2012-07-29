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
	}
};