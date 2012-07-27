package my.webapp.homeapps.util;

import java.io.StringWriter;
import java.io.Writer;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;

public class TemplateUtil {
	public static String genContent(String templateText, Object var) {
		Velocity.init();
		VelocityContext context = new VelocityContext();
		context.put("var", var);
		
		Writer writer = new StringWriter();
		Velocity.evaluate(context, writer, "", templateText);
		
		return writer.toString();
	}
}
