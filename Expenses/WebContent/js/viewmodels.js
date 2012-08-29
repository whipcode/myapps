ViewModel = Backbone.Model.extend({
});

PickerViewModel = Backbone.Model.extend({
	defaults:{
		selectedIdx:-1,
		numOptions:0
	},
	
	validate:function(attr) {
		if (attr.selectedIdx>=attr.numOptions) 
			attr.selectedIdx=attr.numOptions-1; 
		else if (attr.numOptions>0 && attr.selectedIdx<0) 
			this.set('selectedIdx',0);
	}
});

viewmodels = {
	models:{},
	
	init:function() {
		this.models.accountSummary = new this.AccountSummary();
		this.models.assetSummary = new this.AssetSummary();
	},
	
	get:function(modelName) {
		return util.get(this.models, modelName);
	},
	
	AccountSummary:Model.extend({
		/* Required options:
		 * account - which account to summarize
		 * year - which year to summarize
		 */
		initialize:function() {
			this.set({
				openings:new this.Openings(),
				tranTypes:new this.TranTypes(),
				closings:new this.Closings(),
				differences:new this.Differences()
			});
		},
		
		getOpenings:function() {
			return this.openings;
		},
		
		getTranTypes:function() {
			return this.tranTypes;
		},
		
		getClosings:function() {
			return this.closings;
		},
		
		getDifferences:function() {
			return this.differences;
		},
		
		Openings:Collection.extend({
		}),
		
		TranTypes:Collection.extend({
		}),
		
		Closings:Collection.extend({
		}),
		
		Differences:Collection.extend({
		})
	}),
	
	AssetSummary:Model.extend({
		/* Required options:
		 * year - which year to summarize
		 * month - which month to summarize
		 */
		initialize:function() {
			this.set({
				ownerTotals:new Model(bu.getOwnerBlanks()),
				total:new Model({amount:0.00}),
				assetTypes:new Collection({model:this.AssetType})
			});
			
			this.assetTypeMap = {};
			
			datastore.bind('accounts', 'all', this.resetAssetType, this);
			datastore.bind('closings', 'all', this.updateAssetType, this);
			datastore.bind('assets', 'all', this.resetAssetTypes, this);
		},
		
		resetAssetTypes:function() {
			var assetTypes = this.get('assetTypes');
			assetTypes.reset();
			this.assetTypeMap = {};
			
			/* add account first */
			var accounts = datastore.getAccounts();
			for (var i=0; i<accounts.length; i++) {
				var account = accounts.at(i);
				var assetType = account.get('assetType');
				var assetOwner = account.get('accOwner');
				
				if (assetType && assetOwner) {
					var closing = datastore.getClosing(account, this.options.year, this.options.month);
					this.addAccountAsset(account, closing);
				}
			}
			
			/* add assets then */
			var assets = datastore.getAssets();
			for (var i=0; i<assets.length; i++) {
				var asset = assets.at(i);
				var assetType = asset.get('type');
				var assetName = asset.get('name');
				var assetRate = datastore.getAssetRate(asset, this.options.year, this.options.month);
			}
		},
		
		addAccountAsset:function(account, closing) {
			var accOwner = account.get('accOwner');
			var amount = closing.get('amount');
			var oldOwnerTotal = this.get('ownerTotals').get(accOwner);
			var oldTotal = this.get('totals');
			
			var newOwnerTotal = {};
			newOwnerTotal[accOwner] = oldOwnerTotal + amount;
			this.get('ownerTotals').set(newTotal);
			this.get('total').set({amount:oldTotal+amount});
			
			/* add account asset into assetTypes */
			var assetType = account.get('assetType');
			
			if (!this.assetTypeMap[assetType]) {
				this.assetTypeMap[assetType] = new this.AssetType();
				this.get('assetTypes').add(this.assetTypeMap[assetType]);
			}
			
			this.assetTypeMap[assetType].addAccountAsset(account, closing);
		},
		
		getAssetTypes:function() {
			return this.assetTypes;
		},
		
		AssetType:Model.extend({
			initialize:function() {
				this.set({
					ownerTotals:new Model(bu.getOwnerBlanks()), 
					total:new Model({amount:0.00}), 
					assets:new Collection({model:this.Asset})
				});
				
				this.assetMap = {};
			},
			
			addAccountAsset:function(account, closing) {
				var accOwner = account.get('accOwner');
				var amount = closing.get('amount');
				var oldOwnerTotal = this.get('ownerTotals').get(accOwner);
				var oldTotal = this.get('totals');
				
				var newOwnerTotal = {};
				newOwnerTotal[accOwner] = oldOwnerTotal + amount;
				this.get('ownerTotals').set(newTotal);
				this.get('total').set({amount:oldTotal+amount});
				
				/* add account asset into assets */
				var assetName = account.get('name');
				
				if (!this.assetMap[assetName]) {
					this.assetMap[assetName] = new this.Asset();
					this.get('assets').add(this.assetMap[assetName]);
				}
				
				this.assetMap[assetName].addAccountAsset(account, closing);
			},
			
			Asset:Model.extend({
				initialize:function() {
					this.set({
						ownerAmounts:new Model(bu.getOwnerBlanks()), 
						total:new Model({amount:0.00})
					});
				},
				
				addAccountAsset:function(account, closing) {
				}
			})
		})
	})
};