package my.webapp.homeapps.dao;

import java.util.List;
import org.hibernate.Session;

@SuppressWarnings("unchecked")
public class HouseItemDao {

	public List queryCatalogs() {
        Session session = DbUtil.getSessionFactory().getCurrentSession();
        List result;
        
        session.beginTransaction();

        /* Should get userId from session so that calendar is filtered */
        result = session.createQuery("from HouseItemCatg").list();

        session.getTransaction().commit();
		return result;
	}
}
