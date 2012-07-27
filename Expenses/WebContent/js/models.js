Model = Backbone.Model.extend({
});

Collection = Backbone.Collection.extend({
});

Account = Model.extend({});
Accounts = Collection.extend({model:Account});

Balance = Model.extend({});
Balances = Collection.extend({model:Balance});

Transaction = Model.extend({});
Transactions = Collection.extend({model:Transaction});

Reminder = Model.extend({});
Reminders = Collection.extend({modle:Reminder});