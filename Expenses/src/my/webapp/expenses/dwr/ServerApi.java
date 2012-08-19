package my.webapp.expenses.dwr;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import my.webapp.expenses.entity.Account;
import my.webapp.expenses.entity.Asset;
import my.webapp.expenses.entity.AssetAmount;
import my.webapp.expenses.entity.AssetRate;
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
		
		codes.put("tranTypes", Transaction.TRANTYPES);
		
		return codes;
	}
	
	public Map load(int year) {
		Map data = new HashMap();
		List<Account> accounts = null;
		List<Transaction> transactions = null;
		List<Closing> closings = null;
		List<Asset> assets = null;
		List<AssetRate> assetRates = null;
		List<AssetAmount> assetAmounts = null;
		Date lastYearClosingDate = new Date(year-1901, 11, 31);
		Date thisYearClosingDate = new Date(year-1900, 11, 31);
		Session session = DbUtil.beginTranx();
		
		try {
			accounts = session.createCriteria(Account.class).list();

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

			data.put("accounts", accounts);
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
