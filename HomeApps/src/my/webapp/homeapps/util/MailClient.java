package my.webapp.homeapps.util;


import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.sun.mail.smtp.SMTPTransport;

public class MailClient {
	private final String MAILHOST = "smtp.mail.yahoo.com.hk";
	private final String FROM = "keithip2007@yahoo.com.hk";
	private final boolean AUTH = true;
	private final String PROT = "smtp";
	private final String USER = "keithip2007";
	private final String PASSWORD = "tiger2007";
	
	private Properties props = null;
	private Session session = null;
	private Message msg = null;
	
	private void prepProperties() {
	    props = System.getProperties();
	    if (MAILHOST != null) props.put("mail." + PROT + ".host", MAILHOST);
	    if (AUTH) props.put("mail." + PROT + ".auth", "true");
	    props.put("mail.smtp.ssl.enable", "true");
	    props.put("mail.smtp.starttls.enable", "true");
	}
	
	private void prepSession() {
		session = Session.getInstance(props, null);
	}
	
	private void prepMessage(String from, String to, String subject, String content) throws Exception {
		msg = new MimeMessage(session);
		
		if (from != null)
			msg.setFrom(new InternetAddress(from));
		else
			msg.setFrom();

	    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
	    
	    msg.setSubject(subject);
	    
	    msg.setText(content);
	    
	    msg.setHeader("X-Mailer", this.getClass().getName());
	    msg.setSentDate(new Date());
	}
	
	private void sendMessage() throws Exception {
		SMTPTransport smpt = (SMTPTransport)session.getTransport(PROT);
		smpt.connect(MAILHOST, USER, PASSWORD);
		smpt.sendMessage(msg, msg.getAllRecipients());
	}
	
	private void releaseSession() {
		msg = null;
		session = null;
		props = null;
	}
	
	public void sendMail(String to, String subject, String content) throws Exception {
		prepProperties();
		prepSession();
		prepMessage(FROM, to, subject, content);
		sendMessage();
		releaseSession();
	}
}
