function ItemCategory() {
	this.id = 0;
	this.groupName;
	this.name = "";
	this.order = 0;
	this.items = [];
	this.lastUpdate = new Date();
}

function ItemCategoryHelper() {
}

ItemCategoryHelper.prototype.insertBefore = function(categories, targetCategory, newCategory) {
};