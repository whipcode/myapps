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

Reminder = Model.extend({});
Reminders = Collection.extend({modle:Reminder});