package my.webapp.homeapps.test;

import java.util.List;
import java.util.Map;

import my.webapp.homeapps.dao.CookingDao;
import my.webapp.homeapps.dao.DbUtil;
import my.webapp.homeapps.entity.cooking.Food;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class CookingDaoTest {
	private static Logger logger = Logger.getLogger(CookingDaoTest.class);
	private static CookingDao dao = new CookingDao();

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		logger.debug("setUpBeforeClass");
		DbUtil.TestConnection();
	}

	@Before
	public void setUp() throws Exception {
		logger.debug("setUp() -------------------- Start new test case -------------");
	}
	
	@Test
	public void test1() {
		Map data;
		List<Food> foods;

		data = dao.load();
		if (data.size() > 0) {
			foods = (List<Food>) data.get("foods");
			logger.debug("Total number of foods: " + foods.size());
		}
	}
	

}
