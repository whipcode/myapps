Model = Backbone.Model.extend({
	getFieldObj:function(fieldName, formatFn, parseFn) {
		return {
			model:this, 
			fieldName:fieldName, 
			get:function() {
				return this.model.get(this.fieldName);
			}, 
			set:function(value) {
				this.model.set(this.fieldName, value);
			}, 
			bind:function(event, callback, caller) {
				this.model.bind(event+':'+this.fieldName, callback, caller);
			},
			unbind:function(event, callback, caller) {
				this.model.unbind(event+':'+this.fieldName, callback, caller);
			}
		};
	}
});

Collection = Backbone.Collection.extend({
});

Account = Model.extend({});
Accounts = Collection.extend({model:Account});

Closing = Model.extend({});
Closings = Collection.extend({model:Closing});

Transaction = Model.extend({
	defaults:{amount:0,deleted:false}
});
Transactions = Collection.extend({model:Transaction});

Asset = Model.extend({});
Assets = Collection.extend({modle:Asset});

AssetRate = Model.extend({});
AssetRates = Collection.extend({modle:AssetRate});

AssetAmount = Model.extend({});
AssetAmounts = Collection.extend({modle:AssetAmount});
