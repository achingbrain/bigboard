package net.achingbrain.bigboard.spring.mvc.home;

import net.achingbrain.bigboard.settings.Settings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 01/10/2011
 * Time: 13:05
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class HomePageController {

	@Autowired
	private Settings settings;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String page(Model model) throws Exception {
		model.addAttribute("settings", settings);

		return "home";
	}

	public void setSettings(Settings settings) {
		this.settings = settings;
	}
}
