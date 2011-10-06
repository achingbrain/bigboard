package net.achingbrain.bigboard.launcher;

import org.mortbay.jetty.Handler;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.webapp.WebAppContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 01/10/2011
 * Time: 12:45
 * To change this template use File | Settings | File Templates.
 */
public class Launcher {
	private static final Logger LOG = LoggerFactory.getLogger(Launcher.class);

	public static void main(String[] args) throws Exception {
		int port = 8060;

		Server server = new Server(port);
		server.setHandlers(new Handler[]{
				getBigBoardHandler(server)
		});

		server.start();
		server.join();
	}

	private static Handler getBigBoardHandler(Server server) {
		// N.B.  If adding new servers in future, add the src/main/resources
		// directory to the maven project.build.resources list in the pom
		// of this project
		WebAppContext context = new WebAppContext();
		context.setContextPath("/");
		context.setWar("src/main/webapp");
		//context.setVirtualHosts(new String[]{"local.bigboard.achingbrain.net"});
		context.setServer(server);

		return context;
	}
}
