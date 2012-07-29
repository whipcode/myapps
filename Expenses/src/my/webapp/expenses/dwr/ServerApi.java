package my.webapp.expenses.dwr;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import my.webapp.expenses.entity.Account;
import my.webapp.expenses.entity.Transaction;
import my.webapp.expenses.util.DbUtil;

import org.hibernate.Session;

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
	
	public List<Transaction> loadTransactions(int year) {
		List<Transaction> transactions = null;
		Session session = DbUtil.beginTranx();
		
		try {
			/* Get transactions of all accounts in a year to facilitate Asset Summary */
			System.out.println("year:" + year);
			transactions = session.createCriteria(Transaction.class).list();
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return transactions;
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
