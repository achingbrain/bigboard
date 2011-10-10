include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.preferences.AccessPreferences);
include(bigboard.gui.preferences.TicketTypePreferences);
include(bigboard.gui.preferences.TicketStatusPreferences);
include(bigboard.gui.preferences.UserPreferences);
include(bigboard.Server);
include(bbq.gui.button.Tabs);

bigboard.gui.preferences.ServerDetails = new Class.create(bbq.gui.GUIWidget, {
	_panel: null,
	_tabs: null,
	_save: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("ServerDetails");

			this._panel = DOMUtil.createElement("div");
			this._tabs = new bbq.gui.button.Tabs();
			this._tabs.addButton(new bbq.gui.button.GUIButton({
				text: Language.get("serverdetails.access"),
				onClick: this._showServerAccess.bind(this)
			}));
			this._tabs.addButton(new bbq.gui.button.GUIButton({
				text: Language.get("serverdetails.tickettypes"),
				onClick: this._showTicketTypes.bind(this)
			}));
			this._tabs.addButton(new bbq.gui.button.GUIButton({
				text: Language.get("serverdetails.ticketstatuses"),
				onClick: this._showTicketStatuses.bind(this)
			}));
			this._tabs.addButton(new bbq.gui.button.GUIButton({
				text: Language.get("serverdetails.users"),
				onClick: this._showUsers.bind(this)
			}));

			this._save = DOMUtil.createElement("div", new bbq.gui.button.NativeButton({
				text: Language.get("serverdetails.save"),
				onClick: this._save.bind(this)
			}), {className: "savePanel"}); 

			// will be immediately replaced
			this._panel = DOMUtil.createElement("div");
		} catch(e) {
			Log.error("Error constructing ServerDetails", e);
		}
	},

	showServer: function(server) {
		this.options.server = server;
		this._showServerAccess(this.options.server);
	},

	render: function($super) {
		$super();
		this.empty();

		this.appendChild(this._tabs);
		this.appendChild(this._panel);
		this.appendChild(this._save);

		this._showServerAccess(this.options.server);
	},

	_showServerAccess: function() {
		this._panel = this.replaceChild(this._panel, new bigboard.gui.preferences.AccessPreferences({server: this.options.server}));
	},

	_showTicketTypes: function() {
		this._panel = this.replaceChild(this._panel, new bigboard.gui.preferences.TicketTypePreferences({server: this.options.server}));
	},

	_showTicketStatuses: function() {
		this._panel = this.replaceChild(this._panel, new bigboard.gui.preferences.TicketStatusPreferences({server: this.options.server}));
	},

	_showUsers: function() {
		this._panel = this.replaceChild(this._panel, new bigboard.gui.preferences.UserPreferences({server: this.options.server}));
	},

	_save: function() {
		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST);
		var foundServer = false;

		for(var i = 0; i < servers.length; i++) {
			var existingServer = servers[i];

			if(existingServer.getUrl() == this.options.server.getUrl()) {
				servers[i] = this.options.server;

				foundServer = true;
			}
		}

		if(!foundServer) {
			servers.push(this.options.server);
		}

		Preferences.set(BIGBOARD_PREFERENCES.SERVER_LIST, servers);

		currentPage.clearModalLayer();

		// triggers page showing tickets
		this.notifyListeners("onUpdatedServerPreferences");
	}
});
