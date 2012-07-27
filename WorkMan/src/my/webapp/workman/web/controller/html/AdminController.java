package my.webapp.workman.web.controller.html;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
public class AdminController {

	@RequestMapping("/home")
	protected ModelAndView home() {
		return new ModelAndView("home", null);
	}

}
