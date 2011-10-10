include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.web.Preferences);

bigboard.gui.Avatar = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.setRootNode("img");
			this.addClass("Avatar");
		} catch(e) {
			Log.error("Error constructing Avatar", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		// http://my.server.foo:8080/somepath OR http://my.server.foo/somepath
		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
		var index = Preferences.get(BIGBOARD_PREFERENCES.DEFAULT_SERVER, 0);

		if (servers.length >= index) {
			index = 0;
		}

		var server = servers[index];
		var url = server.getUrl();

		var parts = url.split("://");

		// my.server.foo:8080/bar
		url = parts[1];

		parts = url.split(":");

		// my.server.foo OR my.server.foo/bar
		url = parts[0];

		parts = url.split("/");

		// my.server.foo
		url = parts[0];

		var email = this.options.user + "@" + url;
		email = email.toLowerCase();
		
		var hash = Crypto.MD5.hex_md5(email);

		var src = "http://www.gravatar.com/avatar/" + hash;

		if(this.options.size) {
			src += "?s=" + this.options.size;
		}

		this.setAttribute("src", src);
		this.setAttribute("title", this.options.user);
		this.setAttribute("alt", this.options.user);
	}
});
