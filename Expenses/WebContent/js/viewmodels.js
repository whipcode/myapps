ViewModel = Backbone.Model.extend({
});

PickerViewModel = ViewModel.extend({
	defaults:{
		selectedIdx:-1,
		numOptions:0
	},
	
	validate:function(attr) {
		if (attr.selectedIdx>=attr.numOptions) 
			attr.selectedIdx=attr.numOptions-1; 
	}
});

AssetSummaryViewModel = ViewModel.extend({
	defaults:{
		grandTotal:0.00, 
		ownerTotals:new Model({'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00}), 
		accountAssetTypes:new Collection(), 
		individualAssetTypes:new Collection()
	},
	
	digestClosings:function() {
		var _accountAssetTypes = [];
		
		var closingsByAssetTypeByAccName = datastore.getClosingsOfYearOfMonthByAssetTypeByAccName(page.pagestate.get('selectedYear'), page.pagestate.get('selectedMonth'));
		for (var assetType in closingsByAssetTypeByAccName) {
			var _accountAssetType = {name:assetType, total:0.00, ownerTotals:{'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00}, assets:[]};
			var closingsByAccName = closingsByAssetTypeByAccName[assetType];
			
			for (var accName in closingsByAccName) {
				var _asset = {name:accName, total:0.00, ownerTotals:{'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00}};
				var closings = closingsByAccName[accName];
				
				for (var i=0; i<closings.length; i++) {
					var closing = closings[i];
					var amount = closing.get('amount');
					var owner = closing.get('account').accOwner;
					
					_asset.total += amount;
					_asset.ownerTotals[owner] += amount;
					_accountAssetType.total += amount;
					_accountAssetType.ownerTotals[owner] += amount;
				}
				
				_accountAssetType.assets.push(_asset);
			}
			
			_accountAssetTypes.push(util.newModel(_accountAssetType));
		}
		
		this.get('accountAssetTypes').reset(_accountAssetTypes);
	},
	
	digestIndividaulAssetTypes:function() {
	},
	
	AccountAssetType:ViewModel.extend({
		update:function(closings) {
			var _accountAssetType = {name:null, total:0.00, ownerTotals:new Model(), accounts:new Collection()};
			
			if (closings.length > 0) {
				_accountAssetType.name = util.get(closings[0], 'account.assetType');
				
				for (var i=0; i<closings.length; i++) {
					var closing = closings[i];
					
					_accountAssetType += util.get(closing, 'amount');
					_accountAssetType.ownerTotals[util.get(closing, 'account.accOwner')] += util.get(closing, 'amount');
					
					var account = new this.Account();
					account.update(closing);
					_accountAssetType.accounts.add(account);
				}
			}
			
			this.set(_accountAssetType);
		}
	})
});