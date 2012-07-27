package my.webapp.homeapps.entity.cooking;

import java.util.HashSet;
import java.util.Set;

import my.webapp.homeapps.sys.DbRecord;

public class Food extends DbRecord{
	private String name;
	private Set<FoodType> foodTypes = new HashSet<FoodType>();
	private Set<FoodIngredient> foodIngredients = new HashSet<FoodIngredient>();
	private Set<FoodDescription> descriptions = new HashSet<FoodDescription>();
	private Set<FoodPicture> pictures = new HashSet<FoodPicture>();
	private boolean selected;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Set<FoodType> getFoodTypes() {
		return foodTypes;
	}
	public void setFoodTypes(Set<FoodType> foodTypes) {
		this.foodTypes = foodTypes;
	}
	public Set<FoodIngredient> getFoodIngredients() {
		return foodIngredients;
	}
	public void setFoodIngredients(Set<FoodIngredient> foodIngredients) {
		this.foodIngredients = foodIngredients;
	}
	public Set<FoodDescription> getDescriptions() {
		return descriptions;
	}
	public void setDescriptions(Set<FoodDescription> descriptions) {
		this.descriptions = descriptions;
	}
	public Set<FoodPicture> getPictures() {
		return pictures;
	}
	public void setPictures(Set<FoodPicture> pictures) {
		this.pictures = pictures;
	}
	public boolean isSelected() {
		return selected;
	}
	public void setSelected(boolean selected) {
		this.selected = selected;
	}
}
