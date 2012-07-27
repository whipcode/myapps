package my.webapp.homeapps.web.view.xls;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import my.webapp.homeapps.entity.bankaccount.Account;
import my.webapp.homeapps.entity.bankaccount.Transaction;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractExcelView;

@SuppressWarnings("unchecked")
public class TransactionsExcelView extends AbstractExcelView {
	private int rowCount;
	
	TransactionsExcelView() {
		
	}

	protected void buildExcelDocument(Map<String, Object> model,
			HSSFWorkbook workbook, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		rowCount = 0;

		Account account = (Account) model.get("account");
		
		HSSFSheet sheet = createSheet(workbook, account.getAccName());
		Map styles = createStyles(workbook);

		Collection transactions = account.getTransactions();
		for (Iterator iter=transactions.iterator(); iter.hasNext();) {
			Transaction transaction = (Transaction) iter.next();
			if (!transaction.isDeleteMark()) addRow(sheet, styles, transaction);
		}
	}

	private HSSFSheet createSheet(HSSFWorkbook workbook, String sheetName) {
		int colCount = 0;
		
		HSSFSheet sheet = workbook.createSheet(sheetName);
		HSSFRow header = sheet.createRow(rowCount++);
		
		header.createCell(colCount++).setCellValue("Bank Date");
		header.createCell(colCount++).setCellValue("Category");
		header.createCell(colCount++).setCellValue("Subcategory");
		header.createCell(colCount++).setCellValue("Amount");
		header.createCell(colCount++).setCellValue("Description");
		header.createCell(colCount++).setCellValue("Card");
		header.createCell(colCount++).setCellValue("Remarks");
		header.createCell(colCount++).setCellValue("Record ID");
		
		sheet.setColumnWidth(0, 15*256);
		return sheet;
	}
	
	private Map createStyles(HSSFWorkbook workbook) {
		Map styles = new HashMap();
		HSSFCellStyle style;
		
		style = workbook.createCellStyle();
		style.setDataFormat(HSSFDataFormat.getBuiltinFormat("0.00"));
		styles.put("amount", style);
		
		style = workbook.createCellStyle();
		style.setDataFormat(workbook.createDataFormat().getFormat("yyyy-mm-dd"));
		styles.put("date", style);
		
		return styles;
	}

	private void addRow(HSSFSheet sheet, Map styles, Transaction transaction) {
		HSSFRow row = sheet.createRow(rowCount++);
		int colCount = 0;
		
		row.createCell(colCount++).setCellValue(transaction.getBankDate());
		row.createCell(colCount++).setCellValue(transaction.getTranxCatg());
		row.createCell(colCount++).setCellValue(transaction.getTranxSubcatg());
		row.createCell(colCount++).setCellValue(transaction.getAmount());
		row.createCell(colCount++).setCellValue(transaction.getDesc());
		row.createCell(colCount++).setCellValue(transaction.getCreditCard());
		row.createCell(colCount++).setCellValue(transaction.getRemarks());
		row.createCell(colCount++).setCellValue(transaction.getId());
		
		row.getCell(0).setCellStyle((HSSFCellStyle)styles.get("date"));
		row.getCell(3).setCellStyle((HSSFCellStyle)styles.get("amount"));
	}
}
