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
	
	digestAssets:function() {
		var _individualAssetTypes = [];
		var year = page.pagestate.get('selectedYear');
		var month = page.pagestate.get('selectedMonth');
		
		var assetsByAssetType = datastore.getAssetsByAssetType();

		for (var assetType in assetsByAssetType) {
			var _individualAssetType = {name:assetType, total:0.00, ownerTotals:{'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00}, assets:[]};
			
			var assets = assetsByAssetType[assetType];
			for (var i=0; i<assets.length; i++) {
				var asset = assets[i];
				var assetRate = datastore.getAssetRate(asset, year, month);
				var assetAmounts = datastore.getAssetAmountsOfYearOfMonth(asset, year, month);
				
				var _asset = {name:assets[i].get('name'), model:assets[i], assetRate:datastore.getAssetRate(assets[i], year, month), total:0.00, ownerTotals:{'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00}};
				for (var j=0; j<assetAmounts; j++) {
					var assetAmount = assetAmounts[j];
					
					_asset.total += assetRate.get('rate') * assetAmount.get('units');
					_asset.ownerTotals[assetAmount.get('assetOwner')].amount = assetRate.get('rate') * assetAmount.get('units');
					_asset.ownerTotals[assetAmount.get('assetOwner')].model = assetAmount.get('units');
				}
				
				_individualAssetType.assets.push(_asset);
			}
			
			_individualAssetTypes.push(util.newModel(_individualAssetType));
		}
		
		this.get('individualAssetTypes').reset(_individualAssetTypes);
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