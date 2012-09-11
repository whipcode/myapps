ViewModel = Backbone.Model.extend({
});

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
		for (var a in this.options.attr)
			this.$el.attr(a, this.options.attr[a]);
	},
	
	initContent:function() {
		/* Override me when needed */
		if (typeof(this.options.text) != 'undefined') {
			this.viewModel.set('content', this.options.text);
			this.contentType = 0;
		}
		else if (typeof(this.options.html) != 'undefined') {
			this.viewModel.set('content', this.options.html);
			this.contentType = 1;
		}
		else if (typeof(this.options.value) != 'undefined') {
			this.viewModel.set('content', this.options.value);
			this.contentType = 2;
		}
		else if (typeof(this.options.checked) != 'undefined') {
			this.viewModel.set('content', this.options.checked);
			this.contentType = 3;
		}
		else if (this.model)
			this.digestModel();
	},
	
	render:function() {
//		if (this.renderNonce == this.changeNonce) {
			if (this.contentType == 0)	/* Text View Model */
				this.$el.text(this.format(this.viewModel.get('content')));
			else if (this.contentType == 1)	/* Html View Model */
				this.$el.html(this.format(this.viewModel.get('content')));
			else if (this.contentType == 2)	/* Value View Model */
				this.$el.val(this.format(this.viewModel.get('content')));
			else if (this.contentType == 3)	/* Checkbox View Model */
				this.el.checked = this.viewModel.get('content');
//		}
//		else
//			this.renderNonce = this.changeNonce;
	},

	digestModel:function() {
//		if (this.digestNonce == this.updateNonce) {
//			this.digestNonce++;
			
			if (this.options.formatFn)
				this.viewModel.set('content', this.options.formatFn(this.model));
			else if (this.options.fieldName)
				this.viewModel.set('content', this.model.get(this.options.fieldName));
//		}
//		else
//			this.digestNonce = this.updateNonce;
	},
	
	updateModel:function() {
//		if (this.updateNonce == this.digestNonce) {
//			this.updateNonce++;
//			
			if (this.options.parseFn)
				this.model.set(this.options.parseFn(this.viewModel.get('content')));
			else if (this.options.fieldName)
				this.model.set(this.options.fieldName, this.viewModel.get('content'));
//		}
//		else
//			this.updateNonce = this.digestNonce;
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
	
	append:function(View, options) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (!options) options = {};
		if (!options.viewName)
			options.viewName = this.genViewName();

		view.viewName = options.viewName;
		this.views[options.viewName] = view;
		
		this.$el.append(view.el);
		view.parent = this; 
		
		return view;
	},
	
	prepend:function(View, options) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (!options) options = {};
		if (!options.viewName)
			options.viewName = this.genViewName();

		view.viewName = options.viewName;
		this.views[options.viewName] = view;

		this.$el.prepend(view.el);
		view.parent = this; 
		
		return view;
	},
		
	insertAbove:function(View, options) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (!options) options = {};
		if (!options.viewName)
			options.viewName = this.genViewName();

		view.viewName = options.viewName;
		this.views[options.viewName] = view;

		this.$el.before(view.el);
		view.parent = this.parent;
		
		return view;
	},
		
	insertBelow:function(View, options) {
		var view = new View(options);
		if (!this.views) this.views = {};

		if (!options) options = {};
		if (!options.viewName)
			options.viewName = this.genViewName();

		view.viewName = options.viewName;
		this.views[options.viewName] = view;

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
		'change':'cbChange',
		'blur':'cbChange'
	},
	
	cbChange:function(evt) {
		if (evt.srcElement == this.el && this.viewModel) {
//			this.changeNonce++;
			
			if (this.contentType == 0)
				this.viewModel.set('content', this.parse(this.$el.text()));
			else if (this.contentType == 1)
				this.viewModel.set('content', this.parse(this.$el.html()));
			else if (this.contentType == 2)
				this.viewModel.set('content', this.parse(this.$el.val()));
			else if (this.contentType == 3)
				this.viewModel.set('content', this.el.checked);
		}
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

TextView = View.extend({
	tagName:'span'
});

AmountView = View.extend({
	tagName:'span',
	dp:0,
	widthSep:false,
	
	initContent:function() {
		if (this.options.dp) this.dp = this.options.dp;
		if (this.options.withSep) this.withSep = this.options.withSep;
		
		if (typeof(this.options.amount) != 'undefined')
			this.viewModel.set('content', this.options.amount);
		else if (this.model)
			this.digestModel();
	},
	
	format:function(amount) {
		return util.formatAmount(amount, this.dp, this.withSep);
	},
	
	parse:function(text) {
		return util.str2Amount(text);
	}
});

DateView = View.extend({
	tagName:'span',
	dateFormat:'$(dd) $(Mmm) $(yyyy)',
	
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

Link = View.extend({
	tagName:'a',
	
	initAttr:function() {
		if (this.options.href)
			this.$el.attr('href', this.options.href);
	}
});

ImageView = View.extend({
	tagName:'img'
});

List = View.extend({
	tagName:'ul'
});

NumberedList = View.extend({
	tagName:'ol'
});

ListItem = View.extend({
	tagName:'li'
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
	withSep:false,
	
	initAttr:function() {
		this.$el.attr('type', 'text');
	},
	
	initContent:function() {
		if (this.options.dp) this.dp = this.options.dp;
		if (this.options.withSep) this.withSep = this.options.withSep;
		
		if (typeof(this.options.amount) != 'undefined')
			this.viewModel.set('content', this.options.amount);
		else if (this.model)
			this.digestModel();
	},
	
	format:function(amount) {
		return util.formatAmount(amount, this.dp, this.withSep);
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
	withBlank:false,
	pickNonce:0,
	changeNonce:0,
	
	initialize:function() {
		this.viewModel = new PickerViewModel();
		if (!this.collection) this.collection = new Collection();

		this.collection.bind('reset', this.refresh, this);
		this.viewModel.bind('change:selectedIdx', this.pick, this);
		
		if (this.model) {
			this.model.bind('change', this.digestModel, this);
			this.viewModel.bind('change:selectedIdx', this.updateModel, this);
		}
		
		if (this.options.withBlank)
			this.withBlank = this.options.withBlank;
		
		if (this.options.options)
			this.resetOptions(this.options.options);
		else
			this.refresh();
		
		if (typeof(this.options.selectedIdx) != 'undefined')
			this.viewModel.set('selectedIdx', this.options.selectedIdx);
		else if (this.model)
			this.digestModel();
		else
			this.viewModel.set('selectedIdx', 0);
	},
	
	refresh:function() {
		this.removeChild();
		
		if (this.withBlank)
			this.append(Option);
		
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
		
		this.viewModel.set('numOptions', this.collection.length);
		
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
		this.collection.reset(_options);
	},
	
	digestModel:function() {
		if (this.withBlank) {
			var check = this.options.parseFn(null, 0);
			var found = true;
			for (var a in check)
				if (!util.comp(this.model.get(a), check[a], true)) {
					found = false;
					break;
				}
			
			if (found) {
				this.viewModel.set('selectedIdx', 0);
				return;
			}
		}
		
		for (var i=0; i<this.collection.length; i++) {
			var check = this.options.parseFn(this.collection.at(i), i+(this.widthBlank?1:0));
			var found = true;
			for (var a in check)
				if (!util.comp(this.model.get(a), check[a], true)) {
					found = false;
					break;
				}
			
			if (found) {
				this.viewModel.set('selectedIdx', i+(this.withBlank?1:0));
				break;
			}
		}
	},
	
	updateModel:function() {
		if (this.withBlank && this.viewModel.get('selectedIdx') == 0)
			this.model.set(this.options.parseFn(null, 0));
		else
			this.model.set(this.options.parseFn(this.collection.at(this.viewModel.get('selectedIdx')-(this.withBlank?1:0)), this.viewModel.get('selectedIdx')));
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
		
		this.options.viewName = null;
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.textInput = this.append(TextInput, this.options);
	},
	
	get:function() {
		return this.textInput.get();
	},
	
	set:function(content) {
		this.textInput.set(content);
	}
});

DateField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		this.options.viewName = null;
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.dateInput = this.append(DateInput, this.options);
	},
	
	get:function() {
		return this.dateInput.get();
	},
	
	set:function(date) {
		this.dateInput.set(date);
	}
});

AmountField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		this.options.viewName = null;
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.amountInput = this.append(AmountInput, this.options);
	},
	
	get:function() {
		return this.amountInput.get();
	},
	
	set:function(amount) {
		this.amountInput.set(amount);
	}
});

CheckboxField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		this.options.viewName = null;
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.checkbox = this.append(Checkbox, this.options);
	},
	
	get:function() {
		return this.checkbox.get();
	},
	
	set:function(checked) {
		this.checkbox.set(checked);
	}
});

PickerField = View.extend({
	tagName:'div',
	
	initialize:function() {
		this.addClass('Field');
		
		this.options.viewName = null;
		
		if (typeof(this.options.label) != 'undefined') {
			this.append(Label, {text:this.options.label});
			this.options.label = undefined;
		}
		
		this.picker = this.append(Picker, this.options);
	},
	
	get:function() {
		return this.picker.get();
	},
	
	set:function(selectedIdx) {
		this.picker.set(selectedIdx);
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
