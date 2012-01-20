include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.button.Tabs);
include(bigboard.gui.preferences.ServerPreferences);
include(bbq.gui.button.GUIButton);

bigboard.gui.preferences.Preferences = new Class.create(bbq.gui.GUIWidget, {
	_tabs: null,
	_panel: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("Preferences");

			this._tabs = new bigboard.gui.button.Tabs();
			this._tabs.addButton(new bbq.gui.button.GUIButton({
				text: Language.get("preferences.servers"),
				onClick: this._showServerSettings.bind(this)
			}));
			this._panel = DOMUtil.createElement("div");

			// show server tab
			this._tabs.getButton(0).buttonClicked();
		} catch(e) {
			Log.error("Error constructing Preferences", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		this.appendChild(new bbq.gui.button.GUIButton({
			text: Language.get("preferences.close"),
			onClick: function() {
				currentPage.clearModalLayer();
			},
			attributes: {
				className: "closeButton"
			}
		}));

		this.appendChild(DOMUtil.createElement("h2", Language.get("preferences.header")));
		this.appendChild(this._tabs);
		this.appendChild(this._panel);
	},

	_showServerSettings: function() {
		DOMUtil.emptyNode(this._panel);

		var settings = new bigboard.gui.preferences.ServerPreferences();
		settings.appendTo(this._panel);
	}
});
