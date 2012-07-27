function Color() {
	this.rgb = {red:0,RED:255,green:0,GREEN:255,blue:0,BLUE:255};
	this.hsv = {hue:0,HUE:60*6,saturation:0,SATURATION:100,value:0,VALUE:100};
}

Color.prototype.toRGB = function() {
	var padding = 2;
	for (var r = this.rgb.red.toString(16); r.length <padding;) {r='0'+r;} 
	for (var g = this.rgb.green.toString(16); g.length <padding;) {g='0'+g;} 
	for (var b = this.rgb.blue.toString(16); b.length <padding;) {b='0'+b;} 
	return r+g+b;
};

Color.prototype.hueCalc = function(standardHue, RANGE) {
		return Math.min(2*RANGE-Math.min(Math.abs(standardHue),2*RANGE),RANGE) / RANGE;
};

Color.prototype.saturationCalc = function(colorIdx, saturation) {
	return colorIdx + (1-colorIdx)*(1-saturation/this.hsv.SATURATION);
};

Color.prototype.setHSV = function(h,s,v) {
	var RANGE = Math.floor(this.hsv.HUE / 6);
	var REDSHIFT = 0;
	var GREENSHIFT = -RANGE*2;
	var BLUESHIFT = -RANGE*4;
	
	this.hsv.hue = h;
	this.hsv.saturation = s;
	this.hsv.value = v;

	this.rgb.red = Math.floor(this.saturationCalc(this.hueCalc((h<=2*RANGE?h:h-6*RANGE)+REDSHIFT, RANGE),s) * this.rgb.RED * v/this.hsv.VALUE);
	this.rgb.green = Math.floor(this.saturationCalc(this.hueCalc(h+GREENSHIFT, RANGE),s) * this.rgb.GREEN * v/this.hsv.VALUE);
	this.rgb.blue = Math.floor(this.saturationCalc(this.hueCalc(h+BLUESHIFT, RANGE),s) * this.rgb.BLUE * v/this.hsv.VALUE); 
};

