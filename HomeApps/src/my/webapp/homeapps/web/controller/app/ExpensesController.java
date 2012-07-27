package my.webapp.homeapps.web.controller.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
public class ExpensesController {

	@RequestMapping("/expenses")
	protected ModelAndView get() {
		return new ModelAndView("expenses2.jsp", null);
	}

	@RequestMapping("/expenses2")
	protected ModelAndView expenses() {
		return new ModelAndView("expenses2.jsp", null);
	}
}
