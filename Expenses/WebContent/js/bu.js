bu = {
	businessCodes:{},
	
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
	}
};