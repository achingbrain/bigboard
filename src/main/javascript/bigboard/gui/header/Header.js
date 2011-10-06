include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.gui.button.ButtonHolder);
include(bbq.gui.button.GUIButton);
include(bigboard.gui.preferences.ServerPreferences);
include(bbq.gui.form.DropDown);
include(bbq.web.Preferences);

bigboard.gui.header.Header = new Class.create(bbq.gui.GUIWidget, {
	_milestones: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("Header");
		} catch(e) {
			Log.error("Error constructing Error", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this.appendChild(DOMUtil.createElement("h1", Language.get("header.title")));

		var buttonHolder = new bbq.gui.button.ButtonHolder();
		buttonHolder.addButton(new bbq.gui.button.GUIButton({
			text: Language.get("header.server"),
			toolTip: Language.get("header.server"),
			onClick: this.showServerPreferences.bind(this),
			attributes: {
				className: "serverSettings"
			}
		}));

		this.appendChild(buttonHolder);

		this._milestones = this.appendChild(DOMUtil.createElement("label", [
			Language.get("header.milestone"),
			new bbq.gui.form.DropDown()
		]));
	},

	showServerPreferences: function() {
		var prefs = new bigboard.gui.preferences.ServerPreferences();

		currentPage.addModalLayer(prefs);
	},

	showMilestones: function(milestones) {
		var milestoneList = [];

		milestones.each(function(milestone) {
			milestoneList.push({
				key: milestone,
				value: milestone
			});
		});

		var dropDown = new bbq.gui.form.DropDown({
			options: milestoneList,
			onChange: function() {
				Preferences.set(BIGBOARD_PREFERENCES.LAST_SELECTED_MILESTONE, dropDown.getValue());

				this.notifyListeners("onMilestoneSelected", dropDown.getValue());
			}.bind(this)
		});

		DOMUtil.emptyNode(this._milestones);
		this._milestones.appendChild(document.createTextNode(Language.get("header.milestone")));
		dropDown.appendTo(this._milestones);

		var lastMilestone = Preferences.get(BIGBOARD_PREFERENCES.LAST_SELECTED_MILESTONE);

		if(lastMilestone) {
			dropDown.setValue(lastMilestone);
		}

		if(milestones.length > 0) {
			this.notifyListeners("onMilestoneSelected", dropDown.getValue());
		}
	}
});
