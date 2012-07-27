var uif = {
fixedWrappers:new Array(),

init: function() {
	var viewportWidth = 600;
	var viewportHeight = 400;
	
	for (i=0; i<this.fixedWrappers.length; i++) {
		switch (this.fixedWrappers[i].className) {
		case 'top-left-wrapper':
			this.fixedWrappers[i].style.top = '0';
			this.fixedWrappers[i].style.left = '0';
			break;
		case 'top-right-wrapper':
			this.fixedWrappers[i].style.top = '0';
			this.fixedWrappers[i].style.left = (viewportWidth - this.fixedWrappers[i].offsetWidth) + 'px';
			break;
		case 'bottom-left-wrapper':
			this.fixedWrappers[i].style.top = viewportHeight + 'px';
			this.fixedWrappers[i].style.left = '0';
			break;
		case 'bottom-right-wrapper':
			this.fixedWrappers[i].style.top = viewportHeight + 'px';
			this.fixedWrappers[i].style.left = viewportWidth + 'px';
			break;
		default:
			alert(this.fixedWrappers[i].className + "not identified");
		}
		this.fixedWrappers[i].style.visibility = 'visible';
	}
},

addFixedWrapper: function(id) {
	var e = document.getElementById(id);
	this.fixedWrappers.push(e);
},

dummy:null
};
