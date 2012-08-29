ViewModel = Backbone.Model.extend({
	digestNonce:0,
	updateNonce:0,
	
	defaults:{
		content:'',
		type:0	/* 0:Text View Model, 1:Html View Model, 2:Value View Model, 3:Other View Model */
	},
	
	initialize:function() {
		if (this.has('model')) {
			this.get('model').bind('change', this.digestModel, this);
			this.bind('change', this.updateModel, this);
		
			this.digestModel();
		}
	},
	
	digestModel:function() {
		if (this.digestNonce == this.updateNonce) {
			this.digestNonce++;
			
			if (this.has('formatFn'))
				this.set('content', this.get('formatFn').call(this.get('model')));
			else if (this.has('fieldName'))
				this.set('content', this.get('model').get(fieldName));
		}
		else
			this.digestNonce = this.updateNonce;
	},
	
	updateModel:function() {
		if (this.updateNonce == this.digestNonce) {
			this.updateNonce++;
			
			if (this.has('parseFn'))
				this.get('parseFn').call(this.get('model'), this.get('content'));
			else if (this.has('fieldName'))
				this.get('model').set(this.get('fieldName'), this.get('content'));
		}
		else
			this.updateNonce = this.digestNonce;
	}
});

PickerViewModel = Backbone.Model.extend({
	defaults:{
		optionViewModels:new Collection(),	/* collection of viewModels */
		type:0,	/* default Text Option View Model */
		selectedIdx:-1
	},
	
	initialize:function() {
		this.set('optionViewModels', new Collection());
		
		if (this.has('options'))
			this.resetOptions(this.get('options'));
		else if (this.has('collection'))
			this.resetCollection(this.get('collection'));
	},
	
	resetOptions:function(options) {
		var _options = [];
		
		for (var i=0; i<options.length; i++) {
			var optionViewModel = new ViewModel({content:options[i], type:0});
			_options.push(optionViewModel);
		}
		
		this.get('optionViewModels').reset(_options);
	},
	
	resetCollection:function(collection) {
		var _options = [];
		
		for (var i=0; i<collection.length; i++) {
			var optionViewModel = new ViewModel({model:collection.at(i), type:this.get('type')});
			if (this.has('formatFn'))
				optionViewModel.set('formatFn', this.get('formatFn'));
			else if (this.has('fieldName'))
				optionViewModel.set('fieldName', this.get('fieldName'));
			_options.push(optionViewModel);
		}
		
		this.get('optionViewModels').reset(_options);
	},
	
	validate:function(attributes) {
		if (attributes.selectedIdx >= this.get('optionViewModels').length)
			attributes.selectedIdx = this.get('optionViewModels').length - 1;
	}
});

View = Backbone.View.extend({
	_lastViewIdx:0,
	renderNonce:0,
	changeNonce:0,

	initialize:function() {
		if (!this.model) this.model = new ViewModel();
		
		this.model.bind('change:content', this.render, this);
		
		if (typeof(this.options.text) != 'undefined')
			this.model.set({content:this.options.text, type:0});
		else if (typeof(this.options.html) != 'undefined')
			this.model.set({content:this.options.html, type:1});
		else if (typeof(this.options.value) != 'undefined')
			this.model.set({content:this.options.value, type:2});
		else
			this.render();
	},
	
	render:function() {
		if (this.renderNonce == this.changeNonce) {
			var type = this.model.get('type');
			
			if (type == 0)	/* Text View Model */
				this.text(this.model.get('content'));
			else if (type == 1)	/* Html View Model */
				this.html(this.model.get('content'));
			else if (type == 2)	/* Value View Model */
				this.value(this.model.get('content'));
		}
		else
			this.renderNonce = this.changeNonce;
	},
	
	set:function() {
		this.model.set.apply(this.model, arguments);
	},
	
	get:function(attr) {
		return this.model.get(attr);
	},
	
	bind:function(event, callback, caller) {
		this.model.bind(event, callback, caller);
	},
	
	html:function(innerHTML) {
		if (typeof(innerHTML) != 'undefined')
			return this.$el.html(innerHTML);
		else
			return this.$el.html();
	},
	
	text:function(text) {
		if (typeof(text) != 'undefined')
			this.$el.text(text);
		else
			return this.$el.text();
	},
	
	val:function(value) {
		if (typeof(value) != 'undefined')
			this.$el.val(value);
		else
			return this.$el.val();
	},
	
	addClass:function(className) {
		this.$el.addClass(className);
	},
	
	attr:function(attr, value) {
		return this.$el.attr(attr, value);
	},
	
	/* child api */
	genViewName:function() {
		return '_' + (++this._lastViewIdx);
	},
	
	append:function(View, options, viewName) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (typeof(viewName) == 'undefined')
			viewName = this.genViewName();

		view.viewName = viewName;
		this.views[viewName] = view;
		
		this.$el.append(view.el);
		view.parent = this; 
		
		return view;
	},
	
	prepend:function(View, options, viewName) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (typeof(viewName) == 'undefined')
			viewName = this.genViewName();

		view.viewName = viewName;
		this.views[viewName] = view;

		this.$el.prepend(view.el);
		view.parent = this; 
		
		return view;
	},
		
	insertAbove:function(View, options, viewName) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (typeof(viewName) == 'undefined')
			viewName = this.genViewName();

		view.viewName = viewName;
		this.views[viewName] = view;

		this.$el.before(view.el);
		view.parent = this.parent;
		
		return view;
	},
		
	insertBelow:function(View, options, viewName) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (typeof(viewName) == 'undefined')
			viewName = this.genViewName();

		view.viewName = viewName;
		this.views[viewName] = view;

		this.$el.after(view.el);
		view.parent = this.parent;
		
		return view;
	},
	
	removeChild:function(viewName) {
		if (typeof(viewName) != 'undefined')
			this.findView(viewName).remove();
		else {
			for (var a in this.views)
				this.views[a].remove();
		}
	},
	
	findParent:function(className) {
		if (this.parent && this.parent.$el.hasClass(className))
			return this.parent;
		else if (this.parent)
			return this.parent.findParent(className);
		else
			return null;
	},
	
	getView:function(viewName) {
		if (this.views)
			return this.views[viewName];
		else
			return null;
	},
	
	findView:function(viewName) {
		if (this.views) {
			if (this.views[viewName])
				return this.views[viewName];
			
			for (var a in this.views) {
				var view = this.views[a].findView(viewName);
				if (view)
					return view;
			}
		}
			
		return null;
	},
	
	events:{
		'change':'cbChange'
	},
	
	cbChange:function() {
		this.changeNonce++;
		
		if (this.model.has('html'))
			this.model.set(html, this.html());
		else if (this.model.has('text'))
			this.model.set(text, this.text());
		else if (this.model.has('value'))
			this.model.set(value, this.value());
	}
});

Wrapper = View.extend({
	tagName:'div'
});

Span = View.extend({
	tagName:'span'
});

Line = View.extend({
	tagName:'hr'
}),

Text = View.extend({
	tagName:'span'
});

Label = View.extend({
	tagName:'label'
});

Paragraph = View.extend({
	tagName:'p'
});

Amount = View.extend({
	tagName:'span',
	
	initialize:function() {
		var _this = this;
		
		if (!this.options.dp) this.options.dp = 2;
		
		if (!this.model) {
			this.model = new ViewModel({model:new Model({value:this.options.value}), type:0});
			this.model.set('formatFn', function() {
				if (_this.options.prefix)
					return _this.options.prefix + util.formatAmount(value, _this.options.dp);
				else
					return util.formatAmount(value, _this.options.dp);
			});
			this.model.set('parseFn', function(content) {
				if (_this.options.prefix)
					return util.str2Amount(content.substring(_this.options.prefix.length));
				else
					return util.str2Amount(content);
			});
		}
		
		this.model.bind('change:content', this.render, this);
		
		if (typeof(this.options.value) != 'undefined')
			this.model.get('model').set('value', this.options.value);
		else
			this.render();
	},

	setPrefix:function(prefix) {
		this.options.prefix = prefix;
	}
});

Link = View.extend({
	tagName:'a',
	
	initialize:function() {
		if (typeof(this.options.label) != 'undefined')
			this.text(this.options.label);
		
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

Button = View.extend({
	tagName:'button'
});

TextInput = View.extend({
	tagName:'input',
	callback:{},
	
	initialize:function() {
		this.$el.attr('type','text');
		
		if (this.options.modelField)
			this.options.modelField.bind('change', this.update, this);
		
		if (typeof(this.options.text) != 'undefined') 
			this.val(this.options.text);
	},
	
	update:function() {
		this.$el.val(this.options.modelField.get());
	},
	
	events:{
		'change':'cbChange'
	},
	
	cbChange:function() {
		if (this.options.modelField)
			this.options.modelField.set(this.$el.val());

		if (this.callback.cbPickerChange)
			this.callback.cbPickerChange(evt);
	}
});

DateInput = View.extend({
	tagName:'input',
	dateFormat:'$(dd) $(Mmm) $(yyyy)',
	
	initialize:function() {
		this.$el.attr('type','text');
		if (typeof(this.options.date) != 'undefined')
			this.val(this.options.date);
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
	pickNonce:0,
	changeNonce:0,
	callback:{},
	
	initialize:function() {
		if (!this.model) this.model = new PickerViewModel();
		
		this.model.get('optionViewModels').bind('reset', this.refresh, this);
		this.model.bind('change:selectedIdx', this.pick, this);
		
		if (this.options.options)
			this.model.resetOptions(this.options.options);
		else
			this.refresh();
		
		if (this.options.selectedIdx)
			this.model.set('selectedIdx', this.options.selectedIdx);
		else
			this.model.set('selectedIdx', 0);
	},
	
	refresh:function() {
		this.removeChild();
		
		var optionViewModels = this.model.get('optionViewModels');
		for (var i=0; i<optionViewModels.length; i++) {
			this.append(Option, {model:optionViewModels.at(i)});
		}
		
		this.pick();
	},
	
	pick:function() {
		if (this.pickNonce == this.changeNonce)
			this.el.selectedIndex = this.model.get('selectedIdx');
		else
			this.pickNonce = this.changeNonce;
	},
	
	events:{
		'change':'cbChange'
	},
	
	cbChange:function(evt) {
		this.changeNonce++;
		
		this.model.set('selectedIdx', this.el.selectedIndex);
	}
});

Option = View.extend({
	tagName:'option'
});

CollectionPicker = View.extend({
	tagName:'select',
	callback:{},
	
	initialize:function() {
		if (this.options.modelField) 
			this.options.modelField.bind('change', this.modelChanged, this);

		this.collection.bind('add', this.add, this);
		this.collection.bind('reset', this.refresh, this);
		this.collection.bind('remove', this.refresh, this);
		
		if (this.options.onChange) this.onChange(this.options.onChange);
		
		this.refresh();
	},
	
	modelChanged:function() {
		for (var i=0; i<this.collection.length; i++) {
			var optionId = this.options.collection.at(i).get('id');
			if (this.options.modelField.get() == optionId)
				this.idx(i + (this.options.withBlank?1:0));
		}
	},
	
	refresh:function() {
		this.html('');
		
		if (this.options.withBlank)
			this.add(null);

		if (this.options.selectModel && !this.options.selectModel.get)
			this.options.selectModel = new Model(this.options.selectModel);

		for (var i=0; i<this.collection.length; i++) {
			this.add(this.collection.at(i));
			
			var optionId = this.options.collection.at(i).get('id');
			if ((this.options.selectModel && this.options.selectModel.get('id') == optionId) ||
				(this.options.selectedId == optionId) ||
				(this.options.modelField && this.options.modelField.get() == optionId) ||
				this.options.idx == i)
				this.idx(i + (this.options.withBlank?1:0));
		}
	},
	
	add:function(model) {
		this.append(ModelOption, {model:model, displayField:this.options.displayField, displayFn:this.options.displayFn});
	},
	
	onChange:function(cb) {
		this.callback.cbChange = cb;
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
		if (this.options.modelField) this.options.modelField.set(this.getSelectedModel().get('id'));
		if (this.callback.cbChange)
			this.callback.cbChange(this.getSelectedModel());
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
	
	onChange:function(cb) {
		this.getView('picker').onChange(cb);
	},
	
	val:function(value) {
		return this.getView('picker').val(value);
	},
	
	idx:function(idx) {
		return this.getView('picker').idx(idx);
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
	
	onChange:function(cb) {
		this.getView('picker').onChange(cb);
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
	menu:null,
	body:null,
	
	initialize:function() {
		this.addClass('Editor');
		
		if (this.options.label) {
			if (this.options.label.save) this.lblSave = this.options.label.save;
			if (this.options.label.cancel) this.lblSave = this.options.label.cancel;
		}
		
		this.menu = this.append(Wrapper, {className:'Menu'}, 'menu');
		if (this.menu) {
			this.menu.append(Button, {className:'BtnCancel', label:this.lblCancel}, 'btnCancel');
			this.menu.append(Button, {className:'BtnSave', label:this.lblSave}, 'btnSave');
			this.menu.append(Paragraph, {tagName:'h2',className:'Title'}, 'title');
		}
		
		this.body = this.append(Wrapper, {className:'EditArea'}, 'editArea');
	},
	
	setTitle:function(text) {
		this.menu.getView('title').text(text);
	}
});