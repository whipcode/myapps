var appStatus = {
	mode:'',	/* display, edit, new */
	selectedFood:null
};

function Application(htmlId) {
	this.setContext(htmlId);
	
	var viewport = this.add(WuiWrapper, 'viewport');
	if (viewport) {
		var switchingDiv = viewport.add(WuiSwitchingWrapper, 'main', {attr:{show:'foodList'}});
		
		if (switchingDiv) {
			switchingDiv.add(FoodList, 'foodList');
			switchingDiv.add(FoodForm, 'foodForm', {title:'No Title'});
			switchingDiv.add(FoodMenu, 'foodMenu');
			switchingDiv.add(ShoppingList, 'shoppingList');
		}

		viewport.add(Filters, 'filters');
		viewport.add(Buttons, 'buttons');
	}
	
	/* Load Data */
	dwr.engine.setAsync(false);
	data.load(refreshAll);
}
Application.prototype = new WuiElement();

function FoodList(id, attr, callbacks) {
	this.newHtmlElement(id, 'div');
	
	this.add(WuiText, '', {text:'Food List',tag:'h2'});
	this.ul = this.add(WuiList);
}
FoodList.prototype = new WuiElement();

FoodList.prototype.clear = function() {
	this.ul.removeChildElements();
};

FoodList.prototype.addFood = function(food) {
	var li = this.ul.add(WuiListItem, '', {attr:{checked:food.selected?'true':'false'}, userData:food}, {
		click:function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			var userData = evt.currentTarget.userData;
			if (userData.selected)
				userData.selected = false;
			else
				userData.selected = true;
			
			data.updateFoodSelected(userData.id, userData.selected);
			li.setAttribute('checked', userData.selected?'true':'false');
		}
		});
	
	li.add(WuiText, '', {text:food.name,tag:'span'});
	var a = li.add(WuiLink, '', {href:'?food='+food.name,userData:food}, {
		click:function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			editFood(evt.currentTarget.userData);
		}});
	a.add(WuiImage, '', {src:appRoot+'/img/edit.png'});
};

function nameFn(input) {
	var s = 'Apple';
	var idx = s.toLowerCase().indexOf(input.toLowerCase(),0);
	if (idx == 0)
		return s;
	return '';
}

function FoodForm(id, attr, callbacks) {
	this.newHtmlElement(id, 'div');

	this.add(WuiText, id +'.title', {text:attr.title,tag:'h2'});
	var field = this.add(WuiTextField, id+'.fieldFoodName', {label:'名稱'});
	wui.setAutoComplete(field.textInput, nameFn);
	this.add(WuiTextAreaField, id+'.fieldFoodTypes', {label:'食品'});
	this.add(WuiTextAreaField, id+'.fieldIngredients', {label:'材料'});
	this.add(WuiTextAreaField, id+'.fieldMethod', {label:'做法'});
	
}
FoodForm.prototype = new WuiElement();

FoodForm.prototype.setTitle = function(title) {
	var text = wui.getElement(this.htmlElement.id+'.title');
	text.setText(title);
};

FoodForm.prototype.getValues = function(food) {
	var formData = {
		name:wui.getElement(this.htmlElement.id+'.fieldFoodName').getValue(),
		foodTypes:wui.getElement(this.htmlElement.id+'.fieldFoodTypes').getValue(),
		ingredients:wui.getElement(this.htmlElement.id+'.fieldIngredients').getValue(),
		method:wui.getElement(this.htmlElement.id+'.fieldMethod').getValue()
	};
	
	food.name = formData.name;
	
	food.foodTypes = function(textFoodTypes) {
		var foodTypes = [];
		textFoodTypes = textFoodTypes.replace(/^ +/g,'').replace(/, +/g,',').replace(/ +,/g,',').replace(/,,+/g,',').replace(/^,/,'').replace(/,$/,'');
		if (textFoodTypes.length > 0) {
			var textFoodTypeList = textFoodTypes.split(',');
			for (var i=0; i<textFoodTypeList.length; i++) {
				var foodType = data.getFoodType(textFoodTypeList[i]);
				
				foodTypes.push(foodType);
			}
		}
		return foodTypes;
	}(formData.foodTypes);
	
	food.foodIngredients = function(textIngredients) {
		textIngredients = textIngredients.replace(/^ +/g,'').replace(/, +/g,',').replace(/ +,/g,',').replace(/,,+/g,',').replace(/^,/,'').replace(/,$/,'');
		if (textIngredients.length > 0) {
			var textIngredientList = textIngredients.split(',');
			for (var i=0; i<textIngredientList.length; i++) {
				for (var j=0; j<food.foodIngredients.length; j++)
					if (food.foodIngredients[j].ingredient.name == textIngredientList[i])
						break;
				
				if (j == food.foodIngredients.length) {
					var foodIngredient = new FoodIngredient();
					foodIngredient.ingredient = data.getIngredient(textIngredientList[i]);
				
					food.foodIngredients.push(foodIngredient);
				}
			}
		}
		return food.foodIngredients;
	}(formData.ingredients);
	
	if (formData.method) {
		for (var i=0; i<food.descriptions.length; i++)
			if (food.descriptions[i].name == FoodDescription.NAME.METHOD) break;
		
		if (i < food.descriptions.length) {
			food.descriptions[i].description = formData.method;
		}
		else {
			var description = new FoodDescription();
			description.name = FoodDescription.NAME.METHOD;
			description.description = formData.method;
			food.descriptions.push(description);
		}
	}

	return food;
};

FoodForm.prototype.objArray2Text = function(array, field) {
	var text = '';
	var fieldLevels = field.split('.');
	
	function getField(obj, fieldLevels) {
		if (fieldLevels.length == 1)
			return obj[fieldLevels[0]];
		else
			return getField(obj[fieldLevels[0]], fieldLevels.slice(1));
	}
	
	if (array.length > 0) text = getField(array[0], fieldLevels);
	for (var i=1; i<array.length; i++)
		text = text + ', ' + getField(array[i], fieldLevels);
		
	return text;
};

FoodForm.prototype.setValues = function(food) {
	wui.getElement(this.htmlElement.id+'.fieldFoodName').setValue(food.name);
	
	var textFoodTypes = this.objArray2Text(food.foodTypes, 'name');
	wui.getElement(this.htmlElement.id+'.fieldFoodTypes').setValue(textFoodTypes);
	
	var textIngredients = this.objArray2Text(food.foodIngredients, 'ingredient.name');
	wui.getElement(this.htmlElement.id+'.fieldIngredients').setValue(textIngredients);
	
	var method = function getDescription(name) {
		for (var i=0; i<food.descriptions.length; i++)
			if (food.descriptions[i].name == name)
				return food.descriptions[i].description;
		return '';
	}(FoodDescription.NAME.METHOD);
	wui.getElement(this.htmlElement.id+'.fieldMethod').setValue(method);
	
	return food;
};

function FoodMenu(id, attr, callbacks) {
	this.newHtmlElement(id, 'div');
	
	this.add(WuiText, '', {text:'菜單細項',tag:'h2'});
	this.ul = this.add(WuiList);
};
FoodMenu.prototype = new WuiElement();

FoodMenu.prototype.clear = function() {
	this.ul.removeChildElements();
};

FoodMenu.prototype.addFood = function(food) {
	function cbCheckboxClick(evt) {
		var checkbox = evt.currentTarget;
		data.updateFoodIngrdSelected(checkbox.userData.id, checkbox.checked);
		checkbox.userData.selected = checkbox.checked;
	}
	
	var li = this.ul.add(WuiListItem);
	if (li) {
		li.add(WuiText, '', {text:food.name,tag:'h3'});
		var ul = li.add(WuiList);
		for (var i=0; i<food.foodIngredients.length; i++) {
			ul.add(WuiCheckboxField, '', {rearlabel:food.foodIngredients[i].ingredient.name,userData:food.foodIngredients[i]}, {click:cbCheckboxClick}).setValue(food.foodIngredients[i].selected);
		}
	}
};

function ShoppingList(id, attr, callbacks) {
	this.newHtmlElement(id, 'div');
	
	this.add(WuiText, '', {text:'Shopping List',tag:'h2'});
	this.div = this.add(WuiWrapper);
}
ShoppingList.prototype = new WuiElement();

ShoppingList.prototype.clear = function() {
	this.div.removeChildElements();
};

ShoppingList.prototype.addIngredient = function(ingredient) {
	var label = ingredient.ingredient.name;
	
	if (ingredient.foods.length > 0) {
		label = label + ' (' + ingredient.foods[0].name;
		for (var i=1; i<ingredient.foods.length; i++)
			label = label + ', ' + ingredient.foods[i].name; 
		label = label + ')';
	}
		
	this.div.add(WuiCheckboxField, '', {rearlabel:label});
};

function Filters(id, attr, callbacks) {
	this.newHtmlElement(id, 'div');
	
	this.add(WuiLabel, '', {text:'選擇'});
	this.add(WuiSelection, 'slctFoodType');
	this.add(WuiSelection, 'slctMeat');
	this.add(WuiSelection, 'slctVegetable');
	this.add(WuiSelection, 'slctFavorate');
	this.add(WuiSelection, 'slctOthers');
	this.add(WuiButton, 'btnSetting', {text:'Setting'});
}
Filters.prototype = new WuiElement();

function Buttons(id, attr, callbacks) {
	this.newHtmlElement(id, 'div', '', {attr:{show:'foodList'}});
	
	this.add(WuiButton, 'btnNewFood', {text:'New'}, {click:function(evt) {gotoFoodForm(new Food(), 'new');}});
	this.add(WuiButton, 'btnFoodMenu', {text:'Food Menu'}, {click:function(evt) {gotoFoodMenu();}});
	this.add(WuiButton, 'btnFoodList', {text:'Food List'}, {click:function(evt) {gotoFoodList();}});
	this.add(WuiButton, 'btnShoppingList', {text:'Shopping List'}, {click:function(evt) {gotoShoppingList();}});
	this.add(WuiButton, 'btnSave', {text:'Save'}, {click:function(evt) {
		save();}});
	this.add(WuiButton, 'btnCancel', {text:'Cancel'}, {click:function(evt) {cancelEdit();}});
}
Buttons.prototype = new WuiElement();

function refreshAll() {
	refreshFilters();
	refreshFoodList();
	refreshShoppingList();
}

function refreshFilters() {
	var slctFoodType = wui.getElement('slctFoodType');
	var slctMeat = wui.getElement('slctMeat');
	var slctVegetable = wui.getElement('slctVegetable');
	var slctFavorate = wui.getElement('slctFavorate');
	var slctOthers = wui.getElement('slctOthers');
	
	slctFoodType.clear();
	slctFoodType.addOption('', {text:'種類'});
	for (var i=0; i<data.foodTypeList.length; i++)
		slctFoodType.addOption('', {text:data.foodTypeList[i].name});
	
	slctMeat.clear();
	slctMeat.addOption('', {text:'肉類'});
	for (var i=0; i<data.ingredientList.length; i++)
		if (data.ingredientList[i].type == Ingredient.TYPE.MEAT)
			slctMeet.addOption('', {text:data.ingredientList[i].name});
	
	slctVegetable.clear();
	slctVegetable.addOption('', {text:'蔬菜'});
	for (var i=0; i<data.ingredientList.length; i++)
		if (data.ingredientList[i].type == Ingredient.TYPE.VEGETABLE)
			slctVegetable.addOption('', {text:data.ingredientList[i].name});
	
	slctFavorate.clear();
	slctFavorate.addOption('', {text:'調味'});
	for (var i=0; i<data.ingredientList.length; i++)
		if (data.ingredientList[i].type == Ingredient.TYPE.FAVORATE)
			slctFavorate.addOption('', {text:data.ingredientList[i].name});
	
	slctOthers.clear();
	slctOthers.addOption('', {text:'其他'});
	for (var i=0; i<data.ingredientList.length; i++)
		if (data.ingredientList[i].type == Ingredient.TYPE.UNDEFINED)
			slctOthers.addOption('', {text:data.ingredientList[i].name});
};

function refreshFoodList() {
	var foodList = wui.getElement('foodList');
	foodList.clear();
	for (var i = 0; i<data.foods.length; i++) {
		foodList.addFood(data.foods[i]);
	}
}

function refreshShoppingList() {
}

function showMainDiv(id) {
	var main = wui.getElement('main');
	var buttons = wui.getElement('buttons');
	
	main.setAttribute('show', id);
	buttons.setAttribute('show', id);
};

function gotoFoodForm(food, mode) {
	appStatus.selectedFood = food;
	appStatus.mode = mode;

	var foodForm = wui.getElement('foodForm');
	foodForm.setTitle('Edit');
	foodForm.setValues(appStatus.selectedFood);
	showMainDiv('foodForm');
}

function gotoFoodList() {
	appStatus.selectedFood = null;
	appStatus.mode = '';
	showMainDiv('foodList');
}

function gotoFoodMenu() {
	appStatus.selectedFood = null;
	appStatus.mode = '';
	
	/* get selected food data and refresh Food Menu */
	var foodMenu = wui.getElement('foodMenu');
	foodMenu.clear();
	
	for (var i=0; i<data.foods.length; i++) {
		if (data.foods[i].selected) {
			data.loadFood(data.foods[i]);
			foodMenu.addFood(data.foods[i]);
		}
	}
	
	showMainDiv('foodMenu');
}

function gotoShoppingList() {
	appStatus.selectedFood = null;
	appStatus.mode = '';
	
	/* refresh shopping list */
	var shoppingList = wui.getElement('shoppingList');
	shoppingList.clear();
	
	var selectedIngredients = {};
	for (var i=0; i<data.foods.length; i++) {
		if (data.foods[i].selected) {
			var food = data.foods[i];
			for (var j=0; j<food.foodIngredients.length; j++) {
				var foodIngredient = food.foodIngredients[j];
				if (foodIngredient.selected) {
					var key = 's'+foodIngredient.ingredient.id;
					if (!selectedIngredients[key]) selectedIngredients[key] = {ingredient:null,foods:[]};
					selectedIngredients[key].ingredient = foodIngredient.ingredient;
					selectedIngredients[key].foods.push(food);
				}
			}
		}
	}
	
	for (var a in selectedIngredients)
		shoppingList.addIngredient(selectedIngredients[a]);
	
	showMainDiv('shoppingList');
}

function editFood(food) {
	data.loadFood(food);
	gotoFoodForm(food, 'edit');
}

function save() {
	wui.getElement('foodForm').getValues(appStatus.selectedFood);
	
	data.saveFood(appStatus.selectedFood);
	if (appStatus.mode == 'new') {
		data.foods.push(appStatus.selectedFood);
	}
	refreshAll();
	gotoFoodList();
}

function cancelEdit() {
	gotoFoodList();
}
