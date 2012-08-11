package my.webapp.expenses.dwr;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import my.webapp.expenses.entity.Account;
import my.webapp.expenses.entity.Closing;
import my.webapp.expenses.entity.Transaction;
import my.webapp.expenses.util.DbUtil;
import my.webapp.expenses.util.LogUtil;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@SuppressWarnings("unchecked")
public class ServerApi {
	public Map<String, String[]> loadBusinessCodes() {
		Map<String, String[]> codes = new HashMap<String, String[]>();
		
		codes.put("accTypes", Account.ACCTYPES);
		codes.put("tranTypes", Transaction.TRANTYPES);
		
		return codes;
	}
	
	public List<Account> loadAccounts() {
		List<Account> accounts = null;
		Session session = DbUtil.beginTranx();
		
		try {
			accounts = session.createCriteria(Account.class).list();
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return accounts;
	}
	
	public Account saveAccount(Account account) {
		Session session = DbUtil.beginTranx();

		try {
			session.saveOrUpdate(account);
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return account;
	}
	
	public Closing saveClosing(Closing closing) {
		Session session = DbUtil.beginTranx();

		try {
			LogUtil.debug(this, "saveClosing", closing.getDate().toString());
			session.saveOrUpdate(closing);
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return closing;
	}
	
	public Map loadTransactions(int year) {
		Map data = new HashMap();
		List<Transaction> transactions = null;
		List<Closing> closings = null;
		Date lastYearClosingDate = new Date(year-1901, 11, 31);
		Date thisYearClosingDate = new Date(year-1900, 11, 31);
		Session session = DbUtil.beginTranx();
		
		LogUtil.debug(this, "loadTransactions", lastYearClosingDate.toString());
		
		try {
			/* Get transactions of all accounts in a year to facilitate Asset Summary */
			System.out.println("year:" + year);
			transactions = session.createCriteria(Transaction.class)
					.add(Restrictions.disjunction()
							.add(Restrictions.sqlRestriction("YEAR(TRAN_DATE) = ?", new Integer(year), Hibernate.INTEGER))
							.add(Restrictions.sqlRestriction("YEAR(SETTLE_DATE) = ?", new Integer(year), Hibernate.INTEGER))
							.add(Restrictions.sqlRestriction("YEAR(CLAIM_DATE) = ?", new Integer(year), Hibernate.INTEGER))
							)
					.list();
			closings = session.createCriteria(Closing.class)
					.add(Restrictions.ge("date", lastYearClosingDate))
					.add(Restrictions.le("date", thisYearClosingDate))
					.list();
			
			data.put("transactions", transactions);
			data.put("closings", closings);
			
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
			e.printStackTrace();
		}
		
		return data;
	}
	
	public Transaction saveTransaction(Transaction transaction) {
		Session session = DbUtil.beginTranx();

		try {
			session.saveOrUpdate(transaction);
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return transaction;
	}
}
