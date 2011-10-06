package net.achingbrain.bigboard.spring.mvc.error;

import net.achingbrain.bigboard.settings.Settings;
import org.bbqjs.spring.mvc.ErrorController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 01/10/2011
 * Time: 13:05
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class ErrorPageController extends ErrorController {
	private final static Logger LOG = LoggerFactory.getLogger(ErrorPageController.class);

	@Autowired
	private Settings settings;

	protected ModelAndView getModelAndView() {
		ModelAndView modelAndView = new ModelAndView("error");
		modelAndView.addObject("settings", settings);

		return modelAndView;
	}

	public void setSettings(Settings settings) {
		this.settings = settings;
	}
}
