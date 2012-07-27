function ItemPDO() {
	this.data = {};
}

ItemPDO.prototype.addDataObj = function(objName) {
	this.data[objName] = {};
};

ItemPDO.prototype.setDataObj = function(objName, obj) {
	this.data[objName] = obj;
};

ItemPDO.prototype.load = function() {
};

ItemPDO.prototype.save = function() {
};

ItemPDO.prototype.getDataObj = function(objName) {
};

