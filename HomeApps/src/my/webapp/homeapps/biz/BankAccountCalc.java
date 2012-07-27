package my.webapp.homeapps.biz;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import my.webapp.homeapps.entity.bankaccount.Account;
import my.webapp.homeapps.entity.bankaccount.Balance;
import my.webapp.homeapps.entity.bankaccount.Transaction;

@SuppressWarnings({"deprecation", "unchecked"})
public class BankAccountCalc {
	private static Logger logger = Logger.getLogger(BankAccountCalc.class);

	public static void calcOpening(List<Account> accList) {
		for (Account acc : accList) {
			Map accSummary = new HashMap();
			
			for (Balance bal : acc.getMonthlyBalances()) {
				if (!bal.isDeleteMark()) {
					if (bal.getType().equals("C")) {
						bal.getMonth().setMonth(bal.getMonth().getMonth() + 1);
						bal.setType("O");
					}
					
					logger.debug(new String() + bal.getMonth()+":"+bal.getAmount());
					
					int year = bal.getMonth().getYear();
					Map yearEndSummary = (Map)accSummary.get(year);
					if (yearEndSummary == null) {
						yearEndSummary = new HashMap();
						accSummary.put(bal.getMonth().getYear(), yearEndSummary);
					}
					
					Balance yearEndBal = (Balance)yearEndSummary.get("yearEndBalRec");
					if (yearEndBal == null) {
						yearEndSummary.put("yearEndBalRec", bal);
						yearEndSummary.put("balanceAmount", bal.getAmount());
					}
					else if (bal.getMonth().getMonth() >= yearEndBal.getMonth().getMonth()) {
						yearEndSummary.put("yearEndBalRec", bal);
						yearEndSummary.put("balanceAmount", bal.getAmount());
					}
				}
			}
			
			for (Transaction tranx : acc.getTransactions()) {
				if (!tranx.isDeleteMark()) {
					Map yearEndSummary = (Map)accSummary.get(tranx.getBankDate().getYear());
					if (yearEndSummary == null) {
						yearEndSummary = new HashMap();
						yearEndSummary.put("balanceAmount", 0.0);
						accSummary.put(tranx.getBankDate().getYear(), yearEndSummary);
					}
				
					Balance yearEndBal = (Balance)yearEndSummary.get("yearEndBalRec");
					if (yearEndBal == null || tranx.getBankDate().getMonth() >= yearEndBal.getMonth().getMonth()) {
						Double balanceAmount = (Double)yearEndSummary.get("balanceAmount");
						balanceAmount += tranx.getAmount();
						yearEndSummary.put("balanceAmount", balanceAmount);
					}
				}
			}
			
			Iterator i = accSummary.entrySet().iterator();
			while (i.hasNext()) {
				Map.Entry entry = (Map.Entry)i.next();
				Map yearEndSummary = (Map)entry.getValue();
				Double balanceAmount = (Double)yearEndSummary.get("balanceAmount");
				logger.debug(entry.getKey());
				logger.debug(balanceAmount);
			}
		}
	}
}
