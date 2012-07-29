View = Backbone.View.extend({
	append:function(View, options, id) {
		var view = new View(options);
		if (!this.views) this.views = {};
		if (typeof(id) != 'undefined') {
			view.id = id;
			this.views[id] = view;
		}
		this.$el.append(view.el);
		view.parent = this; 
		
		return view;
	},
	
	prepend:function(View, options, id) {
		var view = new View(options);
		if (!this.views) this.views = {};
		if (typeof(id) != 'undefined') {
			view.id = id;
			this.views[id] = view;
		}
		this.$el.prepend(view.el);
		view.parent = this; 
		
		return view;
	},
		
	insertAbove:function(View, options, id) {
		var view = new View(options);
		if (typeof(id) != 'undefined') {
			view.id = id;
			this.views[id] = view;
		}
		this.$el.before(view.$el);
		view.parent = this.parent;
		
		return view;
	},
	
	findParent:function(id) {
		if (this.parent.id == id)
			return this.parent;
		else if (this.parent)
			return this.parent.findParent(Parent);
		else
			return null;
	},
	
	getView:function(id) {
		if (this.views)
			return this.views[id];
		else
			return null;
	},
	
	findView:function(id) {
		if (this.views[id])
			return this.views[id];
		
		for (var a in this.views) {
			var view = this.views[a].findView(id);
			if (view)
				return view;
		}
		
		return null;
	},
	
	html:function(innerHTML) {
		if (typeof(innerHTML) != 'undefined')
			return this.$el.html(innerHTML);
		else
			return this.$el.html();
	},
	
	val:function(value) {
		if (typeof(value) != 'undefined')
			return this.$el.val(value);
		else
			return this.$el.val();
	},
	
	addClass:function(className) {
		this.$el.addClass(className);
	}
});

Wrapper = View.extend({
	tagName:'div',
});

Label = View.extend({
	tagName:'label',
	
	initialize:function() {
		if (typeof(this.options.text) != 'undefined')
			this.html(this.options.text);
	}
});

Paragraph = View.extend({
	tagName:'p',
	
	initialize:function() {
		if (typeof(this.options.text) != 'undefined')
			this.html(this.options.text);
	}
});

Amount = View.extend({
	tagName:'span',
	dp:2,
	
	initialize:function() {
		if (typeof(this.options.value) != 'undefined')
			this.val(this.options.value);
	},
	
	val:function(value) {
		if (typeof(value) != 'undefined')
			this.html(util.formatAmount(value, this.dp));
		else
			return util.str2Amount(this.html());
	}
});

Span = View.extend({
	tagName:'span',
	
	initialize:function() {
		if (typeof(this.options.text) != 'undefined')
			this.html(this.options.text);
	}
});

Link = View.extend({
	tagName:'a',
	
	initialize:function() {
		if (typeof(this.options.label) != 'undefined')
			this.html(this.options.label);
		
		if (typeof(this.options.href) != 'undefined')
			this.$el.attr('href', this.options.href);
	}
});

Table = View.extend({
	tagName:'table',
	
	addHeader:function(options) {
		return this.append(Table.Header, options, 'header');
	},
	
	addBody:function(options) {
		return this.append(Table.Body, options, 'body');
	},
	
	addFooter:function(options) {
		return this.append(Table.Footer, options, 'footer');
	},
	
	addRow:function(options) {
		if (this.views.footer)
			return this.views.footer.addRow(options);
		else if (this.views.body)
			return this.views.body.addRow(options);
		else if (this.views.header)
			return this.views.header.addRow(options);
		else {
			return this.addBody().addRow(options);
		}
	}
});


TableHeader = View.extend({
	tagName:'thead',
	
	addRow:function(options) {
		return this.append(Table.Row, options);
	}
});

TableBody = View.extend({
	tagName:'tbody'
});

TableFooter = View.extend({
	tagName:'tfoot'
});

TableRow = View.extend({
	tagName:'tr'
});

TableHeaderCell = View.extend({
	tagName:'th',
	
	initialize:function() {
		if (this.options.text)
			this.html(this.options.text);
	}
});

TableCell = View.extend({
	tagName:'td',
	
	initialize:function() {
		if (this.options.text)
			this.html(this.options.text);
	}

});

TextInput = View.extend({
	tagName:'input',
	
	initialize:function() {
		this.$el.attr('type','text');
		if (typeof(this.options.text) != 'undefined')
			this.$el.val(this.options.text);
	},
	
	val:function(text) {
		if (typeof(text) != 'undefined')
			this.$el.val(text);
		else
			return this.$el.val();
	}
});

DateInput = View.extend({
	tagName:'input',
	dateFormat:'$(dd) $(Mmm) $(yyyy)',
	
	initialize:function() {
		this.$el.attr('type','text');
		if (typeof(this.options.date) != 'undefined')
			this.val(this.options.date);
		else
			this.val(util.getToday());
	},
	
	val:function(date) {
		if (typeof(date) != 'undefined')
			this.$el.val(util.formatDate(date, this.dateFormat));
		else {
			var date = new Date();
			util.str2Date(this.$el.val(), date);
			return date;
		}
	}
});

AmountInput = View.extend({
	tagName:'input',
	dp:2,
	
	initialize:function() {
		this.$el.attr('type','text');
		if (typeof(this.options.amount) != 'undefined')
			this.val(this.options.amount);
		else
			this.val(0);
	},
	
	val:function(amount) {
		if (typeof(amount) != 'undefined')
			this.$el.val(util.formatAmount(amount, this.dp));
		else
			return util.str2Amount(this.$el.val());
	}
});

Button = View.extend({
	tagName:'button',
	
	initialize:function() {
		if (typeof(this.options.label) != 'undefined')
			this.html(this.options.label);
	}
});

Checkbox = View.extend({
	tagName:'input',
	
	initialize:function() {
		this.el.type = 'checkbox';
		if (typeof(this.options.value) != 'undefined')
			this.val(this.options.value);
		else if (typeof(this.options.checked) != 'undefined')
			this.checked(this.options.checked);
	},
	
	val:function(value) {
		if (typeof(value) != 'undefined')
			this.$el.val(value);
		else
			return this.$el.val();
	},
	
	checked:function(checked) {
		if (typeof(checked) != 'undefined')
			this.el.checked = checked;
		else
			return this.el.checked;
	}
});

Picker = View.extend({
	tagName:'select',
	callback:{},
	
	initialize:function() {
		if (typeof(this.options.options) != 'undefined') {
			for (var i=0; i<this.options.options.length; i++) {
				this.append(Option, {text:this.options.options[i]});
			}
		}
		
		if (typeof(this.options.idx) != 'undefined')
			this.idx(this.options.idx);
		else if (typeof(this.options.value) != 'undefined')
			this.val(this.options.value);
	},
	
	val:function(value) {
		if (typeof(value) != 'undefine')
			this.$el.val(value);
		else
			return this.$el.val();
	},
	
	idx:function(idx) {
		if (typeof(idx) != 'undefined')
			this.el.selectedIndex = idx;
		else
			return this.el.selectedIndex;
	},
	
	getSelectedIdx:function() {
		return this.el.selectedIndex;
	},
	
	onPickerChange:function(cb) {
		this.callback.cbPickerChange = cb;
	},
	
	events:{
		'change':'cbPickerChange'
	},
	
	cbPickerChange:function(evt) {
		if (this.callback.cbPickerChange)
			this.callback.cbPickerChange(evt);
	}
});

Option = View.extend({
	tagName:'option',
	
	initialize:function() {
		this.render();
	},
	
	render:function(options) {
		if (options && typeof(options.text) != 'undefined') {
			this.html(options.text);
		}
		else if (this.options && typeof(this.options.text) != 'undefined') {
			this.html(this.options.text);
		}
	}
});

CollectionPicker = View.extend({
	tagName:'select',
	callback:{},
	
	initialize:function() {
		this.collection.bind('add', this.add, this);
		this.collection.bind('reset', this.refresh, this);
		this.collection.bind('remove', this.refresh, this);
		
		this.refresh();
	},
	
	refresh:function() {
		this.html('');
		
		if (this.options.withBlank)
			this.add(null);
		
		if (this.options.selectModel && !this.options.selectModel.get)
			this.options.selectModel = new Model(this.options.selectModel);
		
		for (var i=0; i<this.collection.length; i++) {
			this.add(this.collection.at(i));
			if (this.options.selectModel && this.collection.at(i).get('id') == this.options.selectModel.get('id'))
				this.idx(i + this.options.withBlank?1:0);
		}
		
		if (this.options.idx)
			this.idx(this.options.idx);
	},
	
	add:function(model) {
		this.append(ModelOption, {model:model, displayField:this.options.displayField, displayFn:this.options.displayFn});
	},
	
	onPickerChange:function(cb) {
		this.callback.cbPickerChange = cb;
	},
	
	val:function(value) {
		if (typeof(value) != 'undefined')
			this.$el.val(value);
		else
			return this.$el.val();
	},
	
	idx:function(idx) {
		if (typeof(idx) != 'undefined')
			this.el.selectedIndex = idx;
		else
			return this.el.selectedIndex;
	},
	
	getSelectedIdx:function() {
		return this.el.selectedIndex;
	},
	
	getSelectedModel:function() {
		var idx = this.el.selectedIndex;
		return this.collection.at(idx - (this.options.withBlank?1:0));
	},
	
	events:{
		'change':'cbPickerChange'
	},
	
	cbPickerChange:function(evt) {
		if (this.callback.cbPickerChange)
			this.callback.cbPickerChange(evt);
	}
});

ModelOption = View.extend({
	tagName:'option',
	
	initialize:function() {
		if (this.model)
			this.model.bind('change', this.refresh, this);
		this.refresh();
	},
	
	refresh:function() {
		this.html('');
		if (!this.model)
			this.html('');
		else if (typeof(this.options.displayField) != 'undefined')
			this.html(this.model.get(this.options.displayField));
		else if (typeof(this.options.displayFn) == 'function')
			this.html(this.options.displayFn(this.model));
	}
});

TextField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(TextInput, this.options, 'text');
	},
	
	val:function(text) {
		return this.getView('text').val(text);
	}
});

DateField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(DateInput, this.options, 'date');
	},
	
	val:function(date) {
		return this.getView('date').val(date);
	}
});

AmountField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(AmountInput, this.options, 'amount');
	},
	
	val:function(amount) {
		return this.getView('amount').val(amount);
	}
});

CheckboxField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(Checkbox, this.options, 'checkbox');
	},
	
	val:function(value) {
		return this.getView('checkbox').val(value);
	},
	
	checked:function(checked) {
		return this.getView('checkbox').checked(checked);
	}
});

PickerField = View.extend({
	tagName:'div',
	callback:{},
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(Picker, this.options, 'picker');
	},
	
	onPickerChange:function(cb) {
		this.getView('picker').onPickerChange(cb);
	},
	
	val:function() {
		return this.getView('picker').val();
	},
	
	getSelectedIdx:function() {
		return this.getView('picker').getSelectedIdx();
	}
});

CollectionPickerField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(CollectionPicker, this.options, 'picker');
	},
	
	onPickerChange:function(cb) {
		this.getView('picker').onPickerChange(cb);
	},
	
	val:function(value) {
		return this.getView('picker').val(value);
	},
	
	idx:function(idx) {
		return this.getView('picker').idx(idx);
	},
	
	getSelectedIdx:function() {
		return this.getView('picker').getSelectedIdx();
	},
	
	getSelectedModel:function() {
		return this.getView('picker').getSelectedModel();
	}
});

ViewsWrapper = View.extend({
	tagName:'div',
	views:{},
	
	initialize:function() {
		this.addClass('ViewsWrapper');
	},
	
	addView:function(View, options, viewId) {
		var view = this.append(View, options, viewId);
		this.views[viewId] = view;
		return this;
	},
	
	setActiveView:function(viewId) {
		if (this.views[this.$el.attr('activeView')] && this.views[this.$el.attr('activeView')].onInactivate)
			this.views[this.$el.attr('activeView')].onInactivate();
		
		this.$el.attr('activeView', viewId);
		
		if (this.views[this.$el.attr('activeView')] && this.views[this.$el.attr('activeView')].onActivate)
			this.views[this.$el.attr('activeView')].onActivate();

		this.$el.attr('class', this.$el.attr('class'));

		return this;
	},
	
	setViewMode:function(mode) {
		this.$el.attr('viewMode', mode);
	},
	
	view:function(vieweId) {
		return this.views[viewId];
	}
});

Editor = View.extend({
	tagName:'div',
	lblSave:'Save',
	lblCancel:'Cancel',
	cbSave:null,
	cbCancel:null,
	
	initialize:function() {
		this.addClass('Editor');
		
		if (this.options.label) {
			if (this.options.label.save) this.lblSave = this.options.label.save;
			if (this.options.label.cancel) this.lblSave = this.options.label.cancel;
		}
		
		var menu = this.append(Wrapper, {className:'Menu'}, 'menu');
		if (menu) {
			menu.append(Paragraph, {tagName:'h2',className:'Title'}, 'title');
			menu.append(Button, {className:'BtnSave', label:this.lblSave});
			menu.append(Button, {className:'BtnCancel', label:this.lblCancel});
		}
		this.append(Wrapper, {className:'EditArea'}, 'editArea');
	},
	
	events:{
		'click .BtnSave':'cbSaveClick',
		'click .BtnCancel':'cbCancelClick'
	},
	
	cbSaveClick:function() {
		if (this.cbSave) this.cbSave();
	},
	
	cbCancelClick:function() {
		if (this.cbCancel) this.cbCancel();
	},
	
	close:function() {
		this.$el.remove();
	},
	
	setTitle:function(text) {
		this.getView('menu').getView('title').html(text);
	},
	
	onSave:function(cbSave) {
		this.cbSave = cbSave;
	},
	
	onCancel:function(cbCancel) {
		this.cbCancel = cbCancel;
	},

	add:function(View, options, viewId) {
		var editArea = this.getView('editArea');
		
		editArea.append(View, options,viewId);
	},
	
	get:function(viewId) {
		return this.getView('editArea').getView(viewId);
	}
});