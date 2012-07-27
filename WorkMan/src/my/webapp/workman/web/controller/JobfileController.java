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
public class JobfileController {
	private Logger logger = Logger.getLogger(JobfileController.class);

	@RequestMapping("")
	protected ModelAndView jobman() {
		return new ModelAndView("jobman.jsp", null);
	}

	@RequestMapping("{filename}")
	protected ModelAndView main(@PathVariable("filename") String filename) {
		Map model = new HashMap();
		
		model.put("filename", filename);
		
		return new ModelAndView("jobfileMain.jsp", model);
	}
}
