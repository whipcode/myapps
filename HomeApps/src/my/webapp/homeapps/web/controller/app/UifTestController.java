package my.webapp.homeapps.web.controller.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
public class UifTestController {

	@RequestMapping("/uif_test.html")
	protected ModelAndView get() {
		return new ModelAndView("uif_test.jsp", null);
	}
	
}
