function FoodType() {
	this.name = '';
	this.seq = 0;
}

function Ingredient() {
	this.name = '';
	this.type = Ingredient.TYPE.UNDEFINED;
	this.seq = 9999;
}
Ingredient.TYPE = {UNDEFINED:'',MEAT:'Meat', VEGETABLE:'Vegetable', FAVORATE:'Favorate'};

function FoodIngredient() {
	this.ingredient = null;
	this.selected = true;
}

function Food() {
	this.name = '';
	this.foodTypes = [];
	this.foodIngredients = [];
	this.descriptions = [];
	this.pictures = [];
	this.selected = 0;
}

function FoodDescription() {
	
	this.seq = 0;
	this.name = '';
	this.description = '';
}
FoodDescription.NAME = {METHOD:'Method'};

function FoodPicture() {
	this.seq = 0;
	this.id = 0;
}

var data = {
	foods:[],
	foodTypeList:[],
	ingredientList:[]
};

data.load = function(callbackFn) {
	CookingDao.load(function(_data) {
		data.foods = _data.foods;
		data.foodTypeList = _data.foodTypes;
		data.ingredientList = _data.ingredients;
		
		callbackFn();
	});
};

data.loadFood = function(food) {
	CookingDao.getFood(food.id, function(_food) {wui.copyObjValues(food,_food);});
	return food;
};

data.saveFood = function(food) {
	CookingDao.saveFood(food, function(savedData) {
		if (savedData.savedFood)
			wui.copyObjValues(food, savedData.savedFood);
		else
			wui.logError("no savedFood");
		
		if (savedData.newFoodTypes)
			for (var i=0; i<savedData.newFoodTypes.length; i++)
				data.foodTypeList.push(savedData.newFoodTypes[i]);
		else
			wui.logError("missing newFoodTypes");
		
		if (savedData.newIngredients)
			for (var i=0; i<savedData.newIngredients.length; i++)
				data.ingredientList.push(savedData.newIngredients[i]);
		else
			wui.logError("missing newIngredients");
		});
	return food;
};

data.updateFoodSelected = function(id, selected) {
	CookingDao.updateFoodSelected(id, selected);
};

data.updateFoodIngrdSelected = function(id, selected) {
	CookingDao.updateFoodIngrdSelected(id, selected);
};

data.getFoodType = function(typeName) {
	var foodType = null;
	
	for (var i = 0; i<this.foodTypeList.length; i++)
		if (this.foodTypeList[i].name == typeName) {
			foodType = this.foodTypeList[i];
			break;
		}
	
	if (!foodType) {
		foodType = new FoodType();
		foodType.name = typeName;
	}
	
	return foodType;
};

data.getIngredient = function(ingredientName) {
	var ingredient = null;
	
	for (var i = 0; i<this.ingredientList.length; i++)
		if (this.ingredientList[i].name == ingredientName) {
			ingredient = this.ingredientList[i];
			break;
		}
	
	if (!ingredient) {
		ingredient = new Ingredient();
		ingredient.name = ingredientName;
	}
	
	return ingredient;
};

