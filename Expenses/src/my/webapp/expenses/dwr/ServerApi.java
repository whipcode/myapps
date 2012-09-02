package my.webapp.expenses.dwr;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import my.webapp.expenses.entity.Account;
import my.webapp.expenses.entity.Asset;
import my.webapp.expenses.entity.AssetAmount;
import my.webapp.expenses.entity.AssetRate;
import my.webapp.expenses.entity.Closing;
import my.webapp.expenses.entity.RepeatDtl;
import my.webapp.expenses.entity.Transaction;
import my.webapp.expenses.util.DateUtil;
import my.webapp.expenses.util.DbUtil;
import my.webapp.expenses.util.LogUtil;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@SuppressWarnings("unchecked")
public class ServerApi {
	public Map<String, String[]> loadBusinessCodes() {
		Map<String, String[]> codes = new HashMap<String, String[]>();
		
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
			e.printStackTrace();
		}

		return accounts;
	}
	
	public Map load(int year) {
		Map data = new HashMap();
		List<Transaction> transactions = null;
		List<Closing> closings = null;
		List<Asset> assets = null;
		List<AssetRate> assetRates = null;
		List<AssetAmount> assetAmounts = null;
		Date lastYearClosingDate = new Date(year-1901, 11, 31);
		Date thisYearClosingDate = new Date(year-1900, 11, 31);
		Session session = DbUtil.beginTranx();
		
		try {
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
			
			assets = session.createCriteria(Asset.class).list();

			assetRates = session.createCriteria(AssetRate.class).list();

			assetAmounts = session.createCriteria(AssetAmount.class).list();

			data.put("transactions", transactions);
			data.put("closings", closings);
			data.put("assets", assets);
			data.put("assetRates", assetRates);
			data.put("assetAmounts", assetAmounts);
			
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
			e.printStackTrace();
		}
		
		return data;
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
	
	public List<Transaction> saveTransactionRepeat(Transaction transaction, RepeatDtl repeatDtl) {
		Session session = DbUtil.beginTranx();
		List<Transaction> transactions = new ArrayList<Transaction>();

		try {
			long repeatKey = transaction.getRepeatKey();
			
			if (repeatKey == 0) {
				repeatKey = new Date().getTime();
				
				transaction.setRepeatKey(repeatKey);
				transactions.add(transaction);
				
				for (int n=1; n<repeatDtl.getTimes(); n++) {
					Transaction repeatedTranx = new Transaction();
					repeatedTranx.set(transaction, true);
					repeatedTranx.setTranDate(DateUtil.addMonth(transaction.getTranDate(), repeatDtl.getMonths() * n));
					repeatedTranx.setSettleDate(DateUtil.addMonth(transaction.getSettleDate(), repeatDtl.getMonths() * n));
					repeatedTranx.setClaimDate(DateUtil.addMonth(transaction.getClaimDate(), repeatDtl.getMonths() * n));
					
					transactions.add(repeatedTranx);
				}
			}
			else if (repeatDtl.isAuto()) {
				transactions = session.createCriteria(Transaction.class)
						.add(Restrictions.eq("tranxAcc", transaction.getTranxAcc()))
						.add(Restrictions.ge("tranDate", transaction.getTranDate()))
						.add(Restrictions.eq("repeatKey", transaction.getRepeatKey()))
						.list();
			
				for (Iterator<Transaction> itTransactions=transactions.iterator(); itTransactions.hasNext();) {
					Transaction repeatedTranx = itTransactions.next();
					repeatedTranx.set(transaction, false);
				}
			}
			else {
				transactions.add(transaction);

				for (int n=1; n<repeatDtl.getTimes(); n++) {
					Date targetTranDate = DateUtil.addMonth(transaction.getTranDate(), repeatDtl.getMonths() * n);
					
					Transaction repeatedTranx = (Transaction)session.createCriteria(Transaction.class)
							.add(Restrictions.eq("tranxAcc", transaction.getTranxAcc()))
							.add(Restrictions.sqlRestriction("YEAR(TRAN_DATE) = ?", new Integer(targetTranDate.getYear()+1900), Hibernate.INTEGER))
							.add(Restrictions.sqlRestriction("MONTH(TRAN_DATE) = ?", new Integer(targetTranDate.getMonth()+1), Hibernate.INTEGER))
							.add(Restrictions.eq("repeatKey", transaction.getRepeatKey()))
							.uniqueResult();
					repeatedTranx.set(transaction, true);
					repeatedTranx.setTranDate(DateUtil.addMonth(transaction.getTranDate(), repeatDtl.getMonths() * n));
					repeatedTranx.setSettleDate(DateUtil.addMonth(transaction.getSettleDate(), repeatDtl.getMonths() * n));
					repeatedTranx.setClaimDate(DateUtil.addMonth(transaction.getClaimDate(), repeatDtl.getMonths() * n));
					
					transactions.add(repeatedTranx);
				}
			}
			
			for (Iterator<Transaction> itTransactions=transactions.iterator(); itTransactions.hasNext();) {
				Transaction temp = itTransactions.next();
				session.saveOrUpdate(temp);
			}
			
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return transactions;
	}
	
	public Asset saveAsset(Asset asset) {
		Session session = DbUtil.beginTranx();

		try {
			session.saveOrUpdate(asset);
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return asset;
	}
	
	public AssetRate saveAssetRate(AssetRate assetRate) {
		Session session = DbUtil.beginTranx();

		try {
			session.saveOrUpdate(assetRate);
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return assetRate;
	}
	
	public AssetAmount saveAssetAmount(AssetAmount assetAmount) {
		Session session = DbUtil.beginTranx();

		try {
			session.saveOrUpdate(assetAmount);
			DbUtil.commit(session);
		}
		catch (Exception e) {
			DbUtil.rollback(session);
		}
		
		return assetAmount;
	}
}
