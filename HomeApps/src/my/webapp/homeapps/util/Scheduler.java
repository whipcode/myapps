package my.webapp.homeapps.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import my.webapp.homeapps.dao.BankAccountDao;
import my.webapp.homeapps.entity.bankaccount.Transaction;

import org.apache.log4j.Logger;

public class Scheduler extends Thread {
	private final boolean TESTING = false;
	
	class StartTime {
		public int HH;
		public int MM;
		
		StartTime(int hh, int mm) {
			HH = hh;
			MM = mm;
		}
	}
	
	private Logger logger = Logger.getLogger(Scheduler.class);
	private final StartTime startTime = new StartTime(10,00);
	
	private void waitStartTime() throws Exception {
		Calendar now = new GregorianCalendar();
		Calendar nextStartTime = new GregorianCalendar();
		
		if (!TESTING) {
			nextStartTime.set(Calendar.HOUR_OF_DAY, startTime.HH);
			nextStartTime.set(Calendar.MINUTE, startTime.MM);
			nextStartTime.set(Calendar.SECOND, 0);
			nextStartTime.set(Calendar.MILLISECOND, 0);
		}
		
		if (nextStartTime.before(now))
			nextStartTime.add(Calendar.DATE, 1);
		
		try {
			DateFormat format = new SimpleDateFormat("HH:mm d MMM yyyy", new Locale("en"));
			logger.trace("Scheduler Next Start Time: " + format.format(nextStartTime.getTime()));
			Scheduler.sleep(nextStartTime.getTimeInMillis() - now.getTimeInMillis());
		} catch (Exception e) {
			throw new Exception();
		}
	}
	
	private void sendReminders() {
		logger.trace("sendReminders()");
		MailClient mail = new MailClient();
		BankAccountDao dao = new BankAccountDao();
		List<Transaction> transactions;
		
		try {
			Calendar today = new GregorianCalendar();
			today.set(Calendar.HOUR_OF_DAY, 0);
			today.set(Calendar.MINUTE, 0);
			today.set(Calendar.SECOND, 0);
			today.set(Calendar.MILLISECOND, 0);

			transactions = dao.queryReminders(today.getTime());
			Iterator<Transaction> itTransactions = transactions.iterator();
			while (itTransactions.hasNext()) {
				Transaction transaction = itTransactions.next();
				
				if (transaction.getAccount().getMailTo() != null && !transaction.getAccount().getMailTo().equals("")) {
					String reminderMsg = TemplateUtil.genContent("Hi, please be reminded to $var.reminderMsg for $var.desc of amount $$var.amount by $var.bankDate.", transaction);
					
					logger.trace("Send Transaction: {" + transaction.getId() + "} to " + transaction.getAccount().getMailTo());
					if (today.getTime().getTime() > transaction.getBankDate().getTime())
						mail.sendMail(transaction.getAccount().getMailTo(), "HomeApps Expenses Reminder (Urgent!)", reminderMsg);
					else
						mail.sendMail(transaction.getAccount().getMailTo(), "HomeApps Expenses Reminder", reminderMsg);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void run() {
		logger.info("Testing Mode = " + TESTING);
		
		do {
			try {
				/* Wait to next start time */
				waitStartTime();
				
				/* Exec tasks */
				sendReminders();
				
				/* Sleep 1 millisecond to avoid run repeatly too fast */
				Scheduler.sleep(1);
			} catch (Exception e) {
				e.printStackTrace();
			}
		} while (!TESTING);
	}
}
