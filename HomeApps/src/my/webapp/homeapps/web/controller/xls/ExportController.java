package my.webapp.homeapps.web.controller.xls;

import java.util.HashMap;
import java.util.Map;

import my.webapp.homeapps.dao.BankAccountDao;
import my.webapp.homeapps.entity.bankaccount.Account;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
@SuppressWarnings("unchecked")
public class ExportController {
	@SuppressWarnings("unused")
	private Logger logger = Logger.getLogger(ExportController.class);

	@RequestMapping("/transaction-{accountId}-{year}-{month}.xls")
	protected ModelAndView exportTransactions(
			@PathVariable("accountId") int accountId,
			@PathVariable("year") int year, @PathVariable("month") int month) {
		Map model = new HashMap();

		BankAccountDao bankAccountDao = new BankAccountDao();
		Account account = bankAccountDao.getAccountTransactionsByMonth(accountId, year,
				month);
		model.put("account", account);

		return new ModelAndView("transactionExcelView", model);
	}
}
