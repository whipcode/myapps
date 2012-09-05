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
	}
});
