Page = View.extend({
	filelist:[
	    {filename:'DSC00665.jpg'},
	    {filename:'DSC00707.jpg'},
	    {filename:'DSC00827.jpg'},
	    {filename:'DSC00859.jpg'},
	    {filename:'P1030093.jpg'},
	    {filename:'P1030176.jpg'},
	    {filename:'P1030300.jpg'},
	    {filename:'P1030462.jpg'},
	    {filename:'P1030470.jpg'},
	    {filename:'P1030513.jpg'}
	],
	          
	initialize:function() {
		this.player = this.append(LivePlayer);
		this.player.play({path:'photo', filelist:this.filelist});
	}
});