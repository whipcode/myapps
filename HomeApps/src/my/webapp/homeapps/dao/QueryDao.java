package my.webapp.homeapps.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.Query;

public class QueryDao extends AbstractDao {
	Logger logger = Logger.getLogger(QueryDao.class);
	
	public Map query(String className, String criteria, int resultsPerPage, int page) {
		Map result = null;
		List records = null;
		int numRecs = 0;
		
		try {
			beginTranx();
			
			String hql = "from " + className;
			if (criteria.length() > 0)
				hql = hql + " where " + criteria;
			
			Query q = session.createQuery(hql);
			q.setFirstResult((page-1)*resultsPerPage);
			q.setMaxResults(resultsPerPage);
			
			records = q.list();
			numRecs = records.size();
			
			result = new HashMap();
			result.put("totalRecs", numRecs);
			result.put("records", records);
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
		
		return result;
	}
	
	public void sql(String sqlStatement) {
		
		try {
			beginTranx();
			
			logger.info("Exec SQL: " + sqlStatement + ";");
			session.createSQLQuery(sqlStatement).executeUpdate();
			
			commit();
		} catch (Exception e) {
			e.printStackTrace();
			rollback();
		}
	}
}
