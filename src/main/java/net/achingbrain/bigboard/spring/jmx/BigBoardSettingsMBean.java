package net.achingbrain.bigboard.spring.jmx;

import net.achingbrain.bigboard.settings.Settings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedOperation;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 01/10/2011
 * Time: 13:01
 * To change this template use File | Settings | File Templates.
 */
public class BigBoardSettingsMBean {

	@Autowired
	private Settings settings;

	@ManagedOperation(description = "Puts BigBoard into debug mode")
	public void setDebugMode(boolean debugMode) {
		settings.setDebugMode(debugMode);
	}

	@ManagedOperation(description = "Tells BigBoard whether to generate new copies of JS and CSS files with every request")
	public void setGenerateSources(boolean generateSources) {
		settings.setGenerateSources(generateSources);
	}

	@ManagedOperation(description = "Tells BigBoard whether to use CDN copies of JS libraries or not")
	public void setUseLocalLibraries(boolean useLocalLibraries) {
		settings.setUseLocalLibraries(useLocalLibraries);
	}
}
