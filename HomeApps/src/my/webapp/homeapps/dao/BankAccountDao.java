package my.webapp.homeapps.dao;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import my.webapp.homeapps.entity.bankaccount.Account;
import my.webapp.homeapps.entity.bankaccount.Asset;
import my.webapp.homeapps.entity.bankaccount.AssetValue;
import my.webapp.homeapps.entity.bankaccount.Balance;
import my.webapp.homeapps.entity.bankaccount.Budget;
import my.webapp.homeapps.entity.bankaccount.Transaction;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@SuppressWarnings("unchecked")
public class BankAccountDao {
	private Logger logger = Logger.getLogger(BankAccountDao.class);
	private Session session = null;
	
	private Session beginTranx() {
        session = DbUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        session.enableFilter("hideDeleted");
        return session;
	}
	
	private void commitTranx() {
		session.getTransaction().commit();
		session = null;
	}
	
	private void rollbackTranx() {
		logger.warn("rollback");
		session.getTransaction().rollback();
		session = null;
	}

	public List getAccounts() {
		List accounts = null;
		Session session = beginTranx();
		accounts = session.createQuery("from Account").list();
        commitTranx();

        return accounts;
	}
	
	public List getAssets() {
		List assets = null;
		Session session = beginTranx();
		assets = session.createCriteria(Asset.class).list();
		commitTranx();
		
		return assets;
	}
	
	public Account getAccountTransactionsByMonth(int accountId, int year, int month) {
		Session session = beginTranx();
		session.enableFilter("yearMonthFilter")
			.setParameter("year", year)
			.setParameter("month", month);
		Account account = (Account)session.createQuery("from Account where id=:accountId")
			.setInteger("accountId", accountId)
			.list().get(0);
		commitTranx();
		
		return account;
	}

	public void createAccount(String accName, String assetCategory, String assetName, String owner) {
        Session session = beginTranx();

        try {
        	Account account = new Account();
        	account.setAccName(accName);
        	account.setAssetCategory(assetCategory);
        	account.setAssetName(assetName);
        	account.setOwner(owner);
			session.saveOrUpdate(account);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public void updateAccountAssetInfo(int id,  String assetCategory, String assetName, String owner) {
        Session session = beginTranx();

        try {
        	Account account = (Account) session.load(Account.class, id);
        	
        	account.setAssetCategory(assetCategory);
        	account.setAssetName(assetName);
        	account.setOwner(owner);
			session.saveOrUpdate(account);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public void updateAccountMailTo(int id,  String mailTo) {
        Session session = beginTranx();

        try {
        	Account account = (Account) session.load(Account.class, id);
        	
        	account.setMailTo(mailTo);
			session.saveOrUpdate(account);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public Account saveAccount(Account account) {
        Session session = beginTranx();

        try {
			session.saveOrUpdate(account);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return account;
	}
	
	public Balance saveMonthlyBalance(Balance balance) {
        logger.debug("saveMonthlyBalance()");
        Session session = beginTranx();

        try {
			session.saveOrUpdate(balance);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return balance;
	}
	
	public Transaction saveTransaction(Transaction transaction) {
        Session session = beginTranx();

        try {
			session.saveOrUpdate(transaction);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return transaction;
	}
	
	public List<Transaction> saveTransactionRepeat(List<Transaction> transactions) {
		logger.trace("saveTransactionRepeat()");
		Session session = beginTranx();
		
		try {
			Iterator<Transaction> itTransactions = transactions.iterator();
			while (itTransactions.hasNext()) {
				Transaction t = itTransactions.next();
				
				session.saveOrUpdate(t);
			}
			
			commitTranx();
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return transactions;
	}
		
	public void saveBudget(Budget budget) {
        Session session = beginTranx();
        logger.debug("saveBudget()");

        try {
			session.saveOrUpdate(budget);
        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public Asset saveAsset(Asset asset) {
        Session session = beginTranx();
        int assetId = 0;

        try {
			session.saveOrUpdate(asset);
			assetId = asset.getId();
        	commitTranx();
        	logger.debug("Saved assetId = " + assetId + ".");
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return asset;
	}
	
	public AssetValue saveAssetValue(AssetValue assetValue) {
        Session session = beginTranx();
        int id = 0;

        try {
			session.saveOrUpdate(assetValue);
			id = assetValue.getId();
        	commitTranx();
        	logger.debug("Saved assetValueId = " + id + ".");
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return assetValue;
	}
	
	public void deleteAllAccounts() {
		List accounts = null;
        Session session = beginTranx();
        
        logger.debug("deleteAllAccounts()");
		
		accounts = session.createQuery("from Account").list();
		
		for (Iterator i=accounts.iterator(); i.hasNext();) {
			session.delete(i.next());
		}
		accounts = session.createQuery("from Account").list();
		
    	commitTranx();
	}
	
	public void createTestingAccount() {
		List accounts = new ArrayList();
        Session session = beginTranx();

        try {
        	Account account = new Account();
        	Transaction transaction = new Transaction();
        	account.setAccName("Testing Account");
        	
			session.saveOrUpdate(account);
			logger.debug("account saved. id="+account.getId());

        	transaction.setAmount(-15);
        	transaction.setBankDate(new Date());
        	transaction.setTranxCatg("Expenditures");
        	transaction.setTranxSubcatg("Basic");
        	transaction.setDesc("testing");
        	transaction.setRemarks("");
			transaction.setAccount(account);
        	account.getTransactions().add(transaction);
        	session.saveOrUpdate(transaction);
			logger.debug("transaction saved. id="+transaction.getId()+", account_id="+transaction.getAccount().getId());

        	accounts.add(account);

        	commitTranx();
        }
		catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
	}
	
	public List<Transaction> queryReminders(Date date) {
		List<Transaction> transactions = new ArrayList();
		Session session = beginTranx();
		Calendar coming5Days = new GregorianCalendar();
		coming5Days.setTime(date);
		coming5Days.add(Calendar.DATE, 5-1);
		
		try {
			transactions = session.createCriteria(Transaction.class)
				.add(Restrictions.isNotNull("reminderMsg"))
				.add(Restrictions.gt("reminderMsg", ""))
				.add(Restrictions.or(Restrictions.le("remindDate", date), Restrictions.and(Restrictions.isNull("remindDate"), Restrictions.le("bankDate", coming5Days.getTime()))))
				.add(Restrictions.eq("remind", false))
				.list();
			
			Iterator<Transaction> itTransactions = transactions.iterator();
			while (itTransactions.hasNext())
				itTransactions.next().getAccount().getMailTo();
			
			logger.trace("queryReminders: " + transactions.size() + " transactions selected");
			
			commitTranx();
		} catch (Exception e) {
			e.printStackTrace();
			rollbackTranx();
		}
		
		return transactions;
	}
}
