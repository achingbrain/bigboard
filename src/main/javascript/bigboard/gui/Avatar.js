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

		var email = this._getUserEmailAddressOverride();

		if(!email) {
			email = this._getEmailFromServerAddress();
		}

		
		var hash = Crypto.MD5.hex_md5(email);

		var src = "http://www.gravatar.com/avatar/" + hash;

		if(this.options.size) {
			src += "?s=" + this.options.size;
		}

		this.setAttribute("src", src);
		this.setAttribute("title", this.options.user);
		this.setAttribute("alt", this.options.user);
	},

	_getUserEmailAddressOverride: function() {
		var override = null;

		currentPage.server.getUsers().each(function(user) {
			if (user.name == this.options.user) {
				override = user.email;
			}
		}.bind(this));

		return override;
	},

	_getEmailFromServerAddress: function() {
		var server = currentPage.server;
		var url = server.getGlobalAvatarOverrideUrl();

		if(!url) {
			// http://my.server.foo:8080/somepath OR http://my.server.foo/somepath
			url = server.getUrl();

			var parts = url.split("://");

			// my.server.foo:8080/bar
			url = parts[1];

			parts = url.split(":");

			// my.server.foo OR my.server.foo/bar
			url = parts[0];

			parts = url.split("/");

			// my.server.foo
			url = parts[0];
		}

		var email = this.options.user + "@" + url;
		email = email.toLowerCase();

		return email;
	}
});
