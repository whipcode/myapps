package my.webapp.workman.web.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller()
@SuppressWarnings({"unused", "unchecked", "rawtypes" })
public class QueryController {
	private Logger logger = Logger.getLogger(QueryController.class);

	@RequestMapping("")
	protected ModelAndView jobman() {
		return new ModelAndView("query.jsp", null);
	}

}
