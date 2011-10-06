package net.achingbrain.bigboard.settings;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 01/10/2011
 * Time: 12:58
 * To change this template use File | Settings | File Templates.
 */
public class Settings {
	private boolean debugMode;
	private boolean generateSources;
	private boolean useLocalLibraries;

	public boolean isDebugMode() {
		return debugMode;
	}

	public void setDebugMode(boolean debugMode) {
		this.debugMode = debugMode;
	}

	public boolean isGenerateSources() {
		return generateSources;
	}

	public void setGenerateSources(boolean generateSources) {
		this.generateSources = generateSources;
	}

	public boolean isUseLocalLibraries() {
		return useLocalLibraries;
	}

	public void setUseLocalLibraries(boolean useLocalLibraries) {
		this.useLocalLibraries = useLocalLibraries;
	}
}
