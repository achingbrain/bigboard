include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.web.Preferences);
include(bbq.gui.button.NativeButton);
include(bigboard.Server);
include(bigboard.gui.preferences.ServerList);
include(bigboard.gui.preferences.ServerDetails);

bigboard.gui.preferences.ServerPreferences = new Class.create(bbq.gui.GUIWidget, {
	_list: null,
	_details: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("ServerPreferences");

			// set up default server list
			var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
			var server;

			if(servers.length == 0) {
				server = new bigboard.Server({});
			} else {
				server = servers[0];
			}

			this._list = new bigboard.gui.preferences.ServerList({
				onAdd: this._addServer.bind(this),
				onImport: this._importServer.bind(this),
				onShow: this._showServer.bind(this),
				selected: server
			});
			this._details = new bigboard.gui.preferences.ServerDetails({server: server});
		} catch(e) {
			Log.error("Error constructing ServerPreferences", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		this.appendChild(this._list);
		this.appendChild(this._details);
	},

	_addServer: function() {
		this._details.showServer(new bigboard.Server({}));
	},

	_showServer: function(server) {
		this._details.showServer(server);
	},

	_importServer: function() {
		var json = prompt(Language.get("serverpreferences.importprompt"));

		if(!json) {
			return;
		}

		var server = PersistenceUtil.deserialize(json);

		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
		servers.push(server);

		Preferences.set(BIGBOARD_PREFERENCES.SERVER_LIST, server);

		this._list.render();
		this._showServer(server);
	}
});
