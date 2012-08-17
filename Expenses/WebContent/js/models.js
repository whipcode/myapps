Model = Backbone.Model.extend({
});

Collection = Backbone.Collection.extend({
});

Account = Model.extend({});
Accounts = Collection.extend({model:Account});

Closing = Model.extend({});
Closings = Collection.extend({model:Closing});

Transaction = Model.extend({});
Transactions = Collection.extend({model:Transaction});

Asset = Model.extend({});
Assets = Collection.extend({modle:Asset});

AssetRate = Model.extend({});
AssetRates = Collection.extend({modle:AssetRate});

AssetAmount = Model.extend({});
AssetAmounts = Collection.extend({modle:AssetAmount});
