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
		
		playModel:1,
		
		initialize:function() {
			this.queue = this.options.queue;
			
			if (this.options.playMode) this.playMode = this.options.playMode;

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
			if (this.playMode == 1) {
				if (this.showingPool.length < 1 && this.stagingPool.length > 0) {
					var imgModel = this.stagingPool.shift();
					this.showingPool.add(imgModel);
					
					this.append(this.SinglePanTilZoom, {el:imgModel.get('img'), pool:this.showingPool, imgModel:imgModel});
				}
			}
		},
		
		SinglePanTilZoom:View.extend({
			className:'SinglePanTilZoom',
			duration:5000,
			transitionLength:1500,
			rotateManager:{clockwise:true},
			
			initialize:function() {
				var _this = this;
				this.$el.attr('class', this.className);
				
				setTimeout(
					function() {
						_this.$el.addClass('FadeIn ZoomIn');
						
						if (_this.rotateManager.clockwise) {
							_this.$el.addClass('RotateC10');
							_this.rotateManager.clockwise = false;
						}
						else {
							_this.$el.addClass('RotateA10');
							_this.rotateManager.clockwise = true;
						}

						setTimeout(
							function() {
								_this.$el.removeClass('FadeIn');
								
								setTimeout(
									function() {
										_this.options.pool.remove(_this.options.imgModel);
										_this.remove();
									}, 
									_this.transitionLength);
							}, 
							_this.duration-_this.transitionLength);
					},
					1);
				
			}
		})
	})
});