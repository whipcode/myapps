package my.webapp.workman.web.controller.img;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
public class ProjController {

	@RequestMapping("/{page}")
	protected ModelAndView toPage(@PathVariable("page") String page) {
		return new ModelAndView(page, null);
	}

	@RequestMapping("/{projCode}/{page}")
	protected ModelAndView toProjectPage(@PathVariable("projCode") String projCode, @PathVariable("page") String page) {
		return new ModelAndView(projCode+"/"+page, null);
	}

}
