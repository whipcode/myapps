package my.webapp.workman.biz.dao;

import java.util.List;

import my.webapp.workman.bo.CountryCalendar;
import my.webapp.workman.bo.CountryDay;
import my.webapp.workman.sys.util.DbUtil;

import org.apache.log4j.Logger;
import org.hibernate.Session;

@SuppressWarnings("unchecked")
public class CalendarDao {
	private Session session;
	private Logger logger = Logger.getLogger(CalendarDao.class);
	
	private void beginTx() {
		this.session = DbUtil.getSession();
		this.session.beginTransaction();
	}
	
	private void commit() {
		this.session.getTransaction().commit();
	}
	
	public int createCountryCalendar(CountryCalendar countryCalendar) {
		logger.trace("createCountryCalendar()");
		this.beginTx();
		
		CountryCalendar calendar = new CountryCalendar();
		calendar.setCalendarName(countryCalendar.getCalendarName());
		this.session.saveOrUpdate(calendar);
		
		this.commit();
		
		return countryCalendar.getId();
	}
	
	public int addCountryDay(CountryDay countryDay) {
		this.beginTx();
		
		this.session.saveOrUpdate(countryDay);
		
		this.commit();
		
		return countryDay.getId();
	}
	
	public List getCountryCalendarList() {
		List result;
		
        Session session = DbUtil.getSession();
        session.beginTransaction();

        session.enableFilter("deleteMarkFilter");
        result = session.createQuery("from CountryCalendar").list();

        session.getTransaction().commit();
		return result;
	}
	
	public CountryCalendar getCountryCalendarOfYear(int id, int year) {
        CountryCalendar countryCalendar;

        Session session = DbUtil.getSession();
        session.beginTransaction();

        session.enableFilter("deleteMarkFilter");
        countryCalendar = new CountryCalendar();

        session.getTransaction().commit();
		return countryCalendar;
	}
}
