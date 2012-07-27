package my.webapp.homeapps.entity.cooking;

import my.webapp.homeapps.sys.DbRecord;


public class FoodIngredient extends DbRecord {
	private boolean selected;
	private Ingredient ingredient;

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setIngredient(Ingredient ingredient) {
		this.ingredient = ingredient;
	}

	public Ingredient getIngredient() {
		return ingredient;
	}
}
