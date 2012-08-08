package my.webapp.expenses.dwr;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import my.webapp.expenses.entity.Account;
import my.webapp.expenses.entity.Closing;
import my.webapp.expenses.entity.Transaction;
import my.webapp.expenses.util.DbUtil;

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
	
	public Map loadTransactions(int year) {
		Map data = new HashMap();
		List<Transaction> transactions = null;
		List<Closing> closings = null;
		Session session = DbUtil.beginTranx();
		
		try {
			/* Get transactions of all accounts in a year to facilitate Asset Summary */
			System.out.println("year:" + year);
			transactions = session.createCriteria(Transaction.class)
					.add(Restrictions.disjunction()
							.add(Restrictions.sqlRestriction("YEAR(TRAN_DATE) = ?", new Integer(year), Hibernate.INTEGER))
							)
					.list();
			closings = session.createCriteria(Closing.class).list();
			
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
