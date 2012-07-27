package my.webapp.homeapps.web.controller.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
public class MariaController {

	@RequestMapping("/maria")
	protected ModelAndView get() {
		return new ModelAndView("maria.jsp", null);
	}
}
