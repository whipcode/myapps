package my.webapp.expenses.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
public class MainController {
	@RequestMapping("/main")
	protected ModelAndView get() {
		return new ModelAndView("main.jsp", null);
	}

}
