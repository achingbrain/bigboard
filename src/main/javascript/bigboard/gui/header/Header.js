include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.gui.button.GUIButton);
include(bigboard.gui.preferences.Preferences);
include(bbq.gui.form.DropDown);
include(bbq.web.Preferences);

bigboard.gui.header.Header = new Class.create(bbq.gui.GUIWidget, {
	_milestones: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("Header");

			bbq.lang.Watchable.registerGlobalListener("onUpdatedServerPreferences", this.render.bind(this))
		} catch(e) {
			Log.error("Error constructing Error", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this.appendChild(DOMUtil.createElement("h1", Language.get("header.title")));

		this.appendChild(new bbq.gui.button.GUIButton({
			text: Language.get("header.preferences"),
			toolTip: Language.get("header.preferences"),
			onClick: this.showServerPreferences.bind(this),
			attributes: {
				className: "serverSettings"
			}
		}));

		if(currentPage.server == null) {
			return;
		}

		var index = Preferences.get(BIGBOARD_PREFERENCES.LAST_SELECTED_SERVER, 0);

		var servers = [];
		Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []).each(function(server) {
			servers.push({
				key: server.getName() ? server.getName() : server.getUrl(),
				value: server
			});
		});

		// show list of servers
		var serverList = new bbq.gui.form.DropDown({
			options: servers,
			value: servers[index].value,
			onChange: function(field) {
				var selected = field.getValue();

				Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []).each(function(server, index) {
					if (server.getUrl() == selected.getUrl()) {
						Preferences.set(BIGBOARD_PREFERENCES.LAST_SELECTED_SERVER, index);

						currentPage.server = server;
					}
				});

				this.notifyListeners("onServerSelected", selected);
			}.bind(this)
		});

		this.appendChild(DOMUtil.createElement("label", [
			Language.get("header.servers"),
			serverList
		]));

		var milestoneList = new bbq.gui.form.DropDown({
			options: this._milestones,
			onChange: function(field) {
				// update server with last selected milestone value
				var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
				servers.each(function(server) {
					if(server.getUrl() == currentPage.server.getUrl()) {
						server.setLastSelectedMilestone(field.getValue());
						currentPage.server.setLastSelectedMilestone(field.getValue());
					}
				});
				Preferences.set(BIGBOARD_PREFERENCES.SERVER_LIST, servers);

				this.notifyListeners("onMilestoneSelected", field.getValue());
			}.bind(this)
		});
		milestoneList.setValue(currentPage.server.getLastSelectedMilestone());

		this._milestones = this.appendChild(DOMUtil.createElement("label", [
			Language.get("header.milestone"),
			milestoneList
		]));
	},

	showServerPreferences: function() {
		var prefs = new bigboard.gui.preferences.Preferences();

		currentPage.addModalLayer(prefs);
	},

	showMilestones: function(milestones) {
		this._milestones = [];
		var milestoneSelected = null;

		milestones.each(function(milestone) {
			if(milestone == currentPage.server.getLastSelectedMilestone()) {
				milestoneSelected = milestone;
			}

			this._milestones.push({
				key: milestone,
				value: milestone
			});
		}.bind(this));

		this.render();

		if(milestones.length > 0) {
			if(!milestoneSelected) {
				milestoneSelected = milestones[0];
			}

			this.notifyListeners("onMilestoneSelected", milestoneSelected);
		}
	}
});
