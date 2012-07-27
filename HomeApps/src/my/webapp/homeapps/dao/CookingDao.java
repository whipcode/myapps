package my.webapp.homeapps.dao;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import my.webapp.homeapps.entity.cooking.Food;
import my.webapp.homeapps.entity.cooking.FoodDescription;
import my.webapp.homeapps.entity.cooking.FoodIngredient;
import my.webapp.homeapps.entity.cooking.FoodType;
import my.webapp.homeapps.entity.cooking.Ingredient;

import org.apache.log4j.Logger;

public class CookingDao extends AbstractDao {
	private Logger logger = Logger.getLogger(CookingDao.class);

	@SuppressWarnings("unchecked")
	public Map saveFood(Food food) {
		Map data = new HashMap();
		Set newFoodTypes = new HashSet();
		Set newIngredients = new HashSet();
		logger.trace("saveFood() called");
		
		try {
			beginTranx();
			
			Iterator<FoodType> itFoodTypes = food.getFoodTypes().iterator();
			while (itFoodTypes.hasNext()) {
				FoodType foodType = itFoodTypes.next();
				
				if (foodType.getId() == 0)	/* new food type */ {
					session.saveOrUpdate(foodType);
					newFoodTypes.add(foodType);
				}
			}
			
			Iterator<FoodIngredient> itFoodIngredients = food.getFoodIngredients().iterator();
			while (itFoodIngredients.hasNext()) {
				FoodIngredient foodIngredient = itFoodIngredients.next();
				
				if (foodIngredient.getId() == 0)	/* new foodIngredient */ {
					if (foodIngredient.getIngredient().getId() == 0) {	/* new ingredient */
						session.saveOrUpdate(foodIngredient.getIngredient());
						newIngredients.add(foodIngredient.getIngredient());
					}
					session.saveOrUpdate(foodIngredient);
				}
			}
			
			Iterator<FoodDescription> itFoodDescription = food.getDescriptions().iterator();
			while (itFoodDescription.hasNext()) {
				FoodDescription foodDescription = itFoodDescription.next();
				
				if (foodDescription.getId() == 0)	/* new food description */
					session.saveOrUpdate(foodDescription);
			}
			
			session.saveOrUpdate(food);
			commitTranx();
			
			data.put("savedFood", food);
			data.put("newFoodTypes", newFoodTypes);
			data.put("newIngredients", newIngredients);
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return data;
	}
	
	public void updateFoodSelected(int id, boolean selected) {
		logger.trace("updateFoodSelected() called");
		try {
			beginTranx();
			
			Food food = (Food) session.load(Food.class, id);
			food.setSelected(selected);
			if (selected) {
				Iterator<FoodIngredient> itFoodIngredients = food.getFoodIngredients().iterator();
				while (itFoodIngredients.hasNext()) {
					FoodIngredient foodIngredient = itFoodIngredients.next();
					foodIngredient.setSelected(true);
					session.saveOrUpdate(foodIngredient);
				}
			}
			session.saveOrUpdate(food);
			
			commitTranx();
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public void updateFoodIngrdSelected(int id, boolean selected) {
		logger.trace("updateFoodIngrdSelected() called");
		try {
			beginTranx();
			
			FoodIngredient foodIngredient = (FoodIngredient) session.load(FoodIngredient.class, id);
			foodIngredient.setSelected(selected);
			session.saveOrUpdate(foodIngredient);
			
			commitTranx();
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public FoodType saveFoodType(FoodType foodType) {
		logger.trace("saveFoodType() called");
		
		try {
			beginTranx();
			
			session.saveOrUpdate(foodType);
			
			commitTranx();
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return foodType;
	}
	
	public void saveIngredient(Ingredient ingredient) {
		logger.trace("createIngredient() called");
		
		try {
			beginTranx();
	
			session.saveOrUpdate(ingredient);
			
			commitTranx();
		} catch (Exception e) {
			rollbackTranx();
		}
	}

	@SuppressWarnings("unchecked")
	public Food getFood(int id) {
		logger.trace("getFood() called");
		Food food = null;
		
		try {
			beginTranx();
			
			food = (Food) session.load(Food.class, id);
			food.getFoodTypes().size();
			
			Iterator<FoodIngredient> itFoodIngredients = food.getFoodIngredients().iterator();
			while (itFoodIngredients.hasNext()) itFoodIngredients.next().getIngredient().getName();

			food.getDescriptions().size();
	
			commitTranx();
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
        return food;
	}

	public List<Ingredient> getIngredients() {
		logger.trace("queryIngredients() called");
		List<Ingredient> ingredients = null;
		
		try {
			beginTranx();
	
			commitTranx();
		} catch (Exception e) {
			rollbackTranx();
		}
        return ingredients;
	}

	public List<FoodType> getFoodTypes() {
		logger.trace("queryFoodType() called");
		List<FoodType> foodTypes = null;
		
		try {
			beginTranx();
	
			commitTranx();
		} catch (Exception e) {
			rollbackTranx();
		}
        return foodTypes;
	}
	
	@SuppressWarnings("unchecked")
	public Map load() {
		logger.trace("load() called");
		Map data = new HashMap();
		List<Food> foods;
		List<FoodType> foodTypes;
		List<Ingredient> ingredients;
		
		try {
			beginTranx();
			
			foods = session.createQuery("from Food fetch all properties").list();
			foodTypes = session.createQuery("from FoodType").list();
			ingredients = session.createQuery("from Ingredient").list();
			
			data.put("foods", foods);
			data.put("foodTypes", foodTypes);
			data.put("ingredients", ingredients);
	
			commitTranx();
		} catch (Exception e) {
			rollbackTranx();
		}
		return data;
	}
	
	@SuppressWarnings("unchecked")
	public int countRecords(String className) {
		logger.trace("countFoods() called");
		List counter = null;
		
		try {
			beginTranx();
			
			counter = session.createQuery("from " + className).list();
			
			commitTranx();
		} catch (Exception e) {
			rollbackTranx();
		}
		
		return counter.size();
	}
}
