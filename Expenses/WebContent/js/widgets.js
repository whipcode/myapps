View = Backbone.View.extend({
	viewModel:null,
	contentType:0,	/* 0:Text Content, 1:Html Content, 2:Value Content; 3:Checkbox Content */
	digestNonce:0,
	updateNonce:0,
	renderNonce:0,
	changeNonce:0,
	_lastViewIdx:0,

	initialize:function() {
		/* When you override this function, you are going to manage your viewModel and model relationship individually */
		this.viewModel = new ViewModel({content:null});
		if (this.options.contentType) this.contentType = this.options.contentType;
		this.viewModel.bind('change:content', this.render, this);
		
		if (this.model) {
			this.model.bind('change', this.digestModel, this);
			this.viewModel.bind('change', this.updateModel, this);
		}
		
		this.initAttr();
		this.initContent();
	},
	
	initAttr:function() {
		/* Override me when needed */
	},
	
	initContent:function() {
		/* Override me when needed */
		if (typeof(this.options.text) != 'undefined')
			this.viewModel.set('content', this.options.text);
		else if (typeof(this.options.html) != 'undefined')
			this.viewModel.set('content', this.options.html);
		else if (typeof(this.options.value) != 'undefined')
			this.viewModel.set('content', this.options.value);
		else if (this.model)
			this.digestModel();
	},
	
	render:function() {
		if (this.renderNonce == this.changeNonce) {
			if (this.contentType == 0)	/* Text View Model */
				this.$el.text(this.format(this.viewModel.get('content')));
			else if (this.contentType == 1)	/* Html View Model */
				this.$el.html(this.format(this.viewModel.get('content')));
			else if (this.contentType == 2)	/* Value View Model */
				this.$el.val(this.format(this.viewModel.get('content')));
		}
		else
			this.renderNonce = this.changeNonce;
	},

	digestModel:function() {
		if (this.digestNonce == this.updateNonce) {
			this.digestNonce++;
			
			if (this.options.formatFn)
				this.viewModel.set('content', this.options.formatFn(this.model));
			else if (this.options.fieldName)
				this.viewModel.set('content', this.model.get(this.options.fieldName));
		}
		else
			this.digestNonce = this.updateNonce;
	},
	
	updateModel:function() {
		if (this.updateNonce == this.digestNonce) {
			this.updateNonce++;
			
			if (this.options.parseFn)
				this.model.set(this.options.parseFn(this.viewModel.get('content')));
			else if (this.options.fieldName)
				this.model.set(this.options.fieldName, this.viewModel.get('content'));
		}
		else
			this.updateNonce = this.digestNonce;
	},
	
	get:function() {
		return this.viewModel.get('content');
	},
	
	set:function(content) {
		this.viewModel.set('content', content);
	},

	/* freq manipulations */
	addClass:function(className) {
		return this.$el.addClass(className);
	},
	
	removeClass:function(className) {
		return this.$el.removeClass(className);
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
		
		if (this.options.contentType == 0)
			this.viewModel.set('content', this.parse(this.$el.text()));
		else if (this.options.contentType == 1)
			this.viewModel.set('content', this.parse(this.$el.html()));
		else if (this.options.contentType == 2)
			this.viewModel.set('content', this.parse(this.$el.val()));
	},
	
	format:function(content) {
		/* Override me when needed */
		return content;
	},
	
	parse:function(text) {
		/* Override me when needed */
		return text;
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
	contentType:0,
	dp:0,
	
	initContent:function() {
		if (this.options.dp) this.dp = this.options.dp;

		if (typeof(this.options.value) != 'undefined')
			this.viewModel.set('content', util.formatAmount(this.options.value, this.dp));
		else if (this.model)
			this.digestModel();
	}
});

Link = View.extend({
	tagName:'a',
	
	initAttr:function() {
		if (this.options.href)
			this.$el.attr('href', this.options.href);
	}
});

Table = View.extend({
	tagName:'table'
});

TableHeader = View.extend({
	tagName:'thead'
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
	tagName:'th'
});

TableCell = View.extend({
	tagName:'td'
});

Button = View.extend({
	tagName:'button'
});

TextInput = View.extend({
	tagName:'input',
	contentType:2,
	
	initAttr:function() {
		this.$el.attr('type', 'text');
	}
});

DateInput = View.extend({
	tagName:'input',
	contentType:2,
	dateFormat:'$(dd) $(Mmm) $(yyyy)',
	
	initAttr:function() {
		this.$el.attr('type', 'text');
	},
	
	initContent:function() {
		if (this.options.dateFormat)
			this.dateFormat = this.options.dateFormat;
		
		if (typeof(this.options.date) != 'undefined')
			this.viewModel.set('content', this.options.date);
		else if (this.model)
			this.digestModel();
	},
	
	format:function(date) {
		return util.formatDate(date, this.dateFormat);
	},
	
	parse:function(text) {
		return util.str2Date(text);
	}
});

AmountInput = View.extend({
	tagName:'input',
	contentType:2,
	dp:0,
	
	initAttr:function() {
		this.$el.attr('type', 'text');
	},
	
	initContent:function() {
		if (this.options.dp) this.dp = this.options.dp;
		
		if (typeof(this.options.amount) != 'undefined')
			this.viewModel.set('content', this.options.amount);
		else if (this.model)
			this.digestModel();
	},
	
	format:function(date) {
		return util.formatAmount(date, this.dp);
	},
	
	parse:function(text) {
		return util.str2Amount(text);
	}
});

Checkbox = View.extend({
	tagName:'input',
	contentType:3,
	
	initAttr:function() {
		this.$el.attr('type', 'checkbox');
	},
	
	initContent:function() {
		if (typeof(this.options.checked) != 'undefined')
			this.viewModel.set('content', this.options.checked);
		else
			this.digestModel();
	}
});

Picker = View.extend({
	tagName:'select',
	viewModel:null,
	pickNonce:0,
	changeNonce:0,
	
	initialize:function() {
		this.viewModel = new ViewModel({selectedIdx:-1, numOptions:0, validate:function(attr) {if (attr.selectedIdx>=attr.numOptions) attr.selectedIdx=attr.numOptions-1;}});
		if (!this.collection) this.collection = new Collection();

		this.collection.bind('reset', this.refresh, this);
		this.viewModel.bind('change:selectedIdx', this.pick, this);
		
		if (this.model) {
			this.model.bind('change', this.digestModel, this);
			this.viewModel.bind('change:selectedIdx', this.updateModel, this);
		}
		
		if (this.options.options)
			this.resetOptions(this.options.options);
		else
			this.refresh();
		
		if (this.options.selectedIdx)
			this.viewModel.set('selectedIdx', this.options.selectedIdx);
		else if (this.model)
			this.lookup();
		else
			this.viewModel.set('selectedIdx', 0);
	},
	
	refresh:function() {
		this.removeChild();
		
		for (var i=0; i<this.collection.length; i++) {
			var options = {
				model:this.collection.at(i),
				contentType:this.options.contentType||0
			};
			if (this.options.formatFn)
				options.formatFn = this.options.formatFn;
			else if (this.options.fieldName)
				options.fieldName = this.options.fieldName;
			this.append(Option, options);
		}
		
		this.pick();
	},
	
	pick:function() {
		if (this.pickNonce == this.changeNonce)
			this.el.selectedIndex = this.viewModel.get('selectedIdx');
		else
			this.pickNonce = this.changeNonce;
	},
	
	resetOptions:function(options) {
		_options = [];
		
		for (var i=0; i<options.length; i++)
			_options.push({text:options[i]});
		
		this.options.fieldName = 'text';
		this.options.formatFn = null;
		this.viewModel.set('numOptions', options.length);
		this.collection.reset(_options);
	},
	
	digestModel:function() {
		for (var i=0; i<this.collection.length; i++) {
			var check = this.options.parseFn(this.collection.at(i));
			var found = true;
			for (var a in check)
				if (this.model.get(a) != check[a]) {
					found = false;
					break;
				}
			
			if (found) {
				this.viewModel.set('selectedIdx', i);
				break;
			}
		}
	},
	
	updateModel:function() {
		this.model.set(this.options.parseFn(this.collection.at(this.viewModel.get('selectedIdx'))));
	},
	
	events:{
		'change':'cbChange'
	},
	
	cbChange:function(evt) {
		this.changeNonce++;
		
		this.viewModel.set('selectedIdx', this.el.selectedIndex);
	},
	
	get:function() {
		return this.viewModel.get('selectedIdx');
	},
	
	set:function(selectedIdx) {
		this.viewModel.set('selectedIdx', selectedIdx);
	}
});

Option = View.extend({
	tagName:'option'
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
	
	get:function() {
		return this.findView('text').get();
	},
	
	set:function(content) {
		this.findView('text').set(content);
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
	
	get:function() {
		return this.findView('date').get();
	},
	
	set:function(date) {
		this.findView('date').set(date);
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
	
	get:function() {
		return this.findView('amount').get();
	},
	
	set:function(amount) {
		this.findView('amount').set(amount);
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
	
	get:function() {
		return this.findView('checkbox').get();
	},
	
	set:function(checked) {
		this.findView('checkbox').set(checked);
	}
});

PickerField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.append(Picker, this.options, 'picker');
	},
	
	get:function() {
		return this.findView('picker').get();
	},
	
	set:function(selectedIdx) {
		this.findView('picker').set(selectedIdx);
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
			this.menu.append(Button, {className:'BtnCancel', text:this.lblCancel}, 'btnCancel');
			this.menu.append(Button, {className:'BtnSave', text:this.lblSave}, 'btnSave');
			this.menu.append(Paragraph, {tagName:'h2',className:'Title'}, 'title');
		}
		
		this.body = this.append(Wrapper, {className:'EditArea'}, 'editArea');
	},
	
	setTitle:function(text) {
		this.findView('title').set(text);
	}
});