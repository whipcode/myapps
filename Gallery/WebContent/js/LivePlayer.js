LivePlayer = View.extend({
	tagName:'div',
	className:'LivePlayer',
	
	queue:new Collection(),
	
	initialize:function() {
		this.menuBar = this.append(this.MenuBar);
		this.playport = this.append(this.PlayPort, {queue:this.queue, playMode:1});
	},
	
	play:function(options) {
		if (options.filelist) {
			for (var i=0; i<options.filelist.length; i++) {
				this.queue.add({url:options.path + '/' + options.filelist[i].filename});
			}
		}
	},
	
	MenuBar:View.extend({
		tagName:'div',
		className:'MenuBar'
	}),
	
	PlayPort:View.extend({
		tagName:'div',
		className:'PlayPort',
		
		queue:null,
		loadingPool:new Collection(),
		stagingPool:new Collection(),
		showingPool:new Collection(),
		
		loadingPoolSize:1,
		showingPoolSize:1,
		
		initialize:function() {
			this.queue = this.options.queue;
			this.showingPool.bind('remove', this.show, this);
			this.stagingPool.bind('remove', this.load, this);
			this.queue.bind('add', this.load, this);
			this.stagingPool.bind('add', this.show, this);
		},
		
		load:function() {
//			console.log('load(): queue = ' + this.queue.length + ', loadingPool = ' + this.loadingPool.length + ', stagingPool = ' + this.stagingPool.length + ', showingPool = ' + this.showingPool.length);
			while (this.queue.length>0 && this.loadingPool.length<this.loadingPoolSize && this.stagingPool.length<this.loadingPoolSize) {
				var photo = this.queue.shift();
				this.loadImg(photo);
			}
		},
		
		loadImg:function(photo) {
			var _this = this;
			var img = new Image();
			var imgModel = new Model({img:img});
			
			this.loadingPool.add(imgModel);
			
			$(img)
				.load(function() {
					_this.loadingPool.remove(imgModel);
					_this.stagingPool.add(imgModel);
				})
				.error(function() {
					_this.loadingPool.remove(imgModel);
				})
				.attr('src', photo.get('url'));
			
		},
		
		show:function() {
			var _this = this;
			if (this.showingPool.length < this.showingPoolSize && this.stagingPool.length > 0) {
				var imgModel = this.stagingPool.shift();
				this.showingPool.add(imgModel);
				
				var img = this.append(ImageView, {el:imgModel.get('img')});
				setTimeout(
					function() {
						img.remove();
						_this.showingPool.shift();
					}, 
					2000);
			}
		}
	})
});