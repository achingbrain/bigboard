include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.web.Preferences);
include(bbq.gui.button.NativeButton);
include(bbq.gui.button.ButtonHolder);
include(bbq.gui.button.GUIButton);

bigboard.gui.preferences.ServerList = new Class.create(bbq.gui.GUIWidget, {
	_list: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("ServerList");
		} catch(e) {
			Log.error("Error constructing ServerList", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("serverlist.add"),
			onClick: this.options.onAdd.bind(this)
		}));
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("serverlist.delete"),
			onClick: this._delete.bind(this)
		}));
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("serverlist.import"),
			onClick: this._import.bind(this)
		}));
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("serverlist.export"),
			onClick: this._export.bind(this)
		}));

		this._list = new bbq.gui.button.ButtonHolder();
		var serverList = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);

		if(serverList.length == 0) {
			this._list = DOMUtil.createElement("ul", (DOMUtil.createElement("li",
					DOMUtil.createElement("p", Language.get("serverlist.noservers"))
			)));
		} else {
			serverList.each(function(server, index) {
				var label;

				if(server.getName()) {
					label = [
						DOMUtil.createElement("h3", server.getName()),
						DOMUtil.createElement("h4", server.getUrl())
					];
				} else {
					label = [
						DOMUtil.createElement("h3", server.getUrl())
					];
				}

				var button = new bbq.gui.button.GUIButton({
					text: label,
					rememberDownState: true,
					onClick: this.options.onShow.bind(this, server)
				});

				if(this.options.selected && server.getUrl() == this.options.selected.getUrl()) {
					this._list.setSelectedIndex(index);
					button.setDown(true);

					this.options.selected = null;
				}

				this._list.addButton(button);
			}.bind(this));
		}

		this.appendChild(this._list);
	},

	_import: function() {
		var json = prompt(Language.get("serverlist.importprompt"));

		if (!json) {
			return;
		}

		var server = PersistenceUtil.deserialize(json);

		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
		servers.push(server);

		Preferences.set(BIGBOARD_PREFERENCES.SERVER_LIST, servers);

		this.options.selected = server;
		this.options.onShow(server);
		this.render();
	},

	_export: function() {
		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
		var index = this._list.getSelectedIndex();

		if(index > -1 && servers[index]) {
			var server = servers[index];
			server.setToken(null);
			var json = PersistenceUtil.serialize(server);

			prompt(Language.get("serverlist.exportprompt"), json);
		}
	},

	_delete: function() {
		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
		var index = this._list.getSelectedIndex();

		if (index > -1 && servers[index]) {
			var server = servers[index];

			servers = servers.without(server);

			Preferences.set(BIGBOARD_PREFERENCES.SERVER_LIST, servers);
		}

		if(servers.length > 0) {
			this.options.selected = servers[0];

		} else {
			this.options.selected = new bigboard.Server({});
		}

		this.options.onShow(this.options.selected);
		this.render();
	}
});
