include(bigboard.page.Page);
include(bigboard.gui.header.Header);
include(bbq.web.Preferences);
include(bbq.lang.Watchable);
include(bigboard.gui.tickets.TicketBoard);

BIGBOARD_PREFERENCES = {
	SERVER: "SERVER",
	TOKEN: "TOKEN",
	SYSTEM: "SYSTEM",
	LAST_SELECTED_MILESTONE: "LAST_SELECTED_MILESTONE"
}

bigboard.page.Home = new Class.create(bigboard.page.Page, {
	_ticketSystem: null,
	_header: null,
	_ticketBoard: null,

	initialize: function($super, args) {
		try {
			$super(args);
		} catch(e) {
			Log.error("Error constructing Home", e);
		}
	},

	_getLanguageSection: function() {
		return "Home";
	},

	_init: function($super) {
		this._header = new bigboard.gui.header.Header();
		this._header.appendTo(document.body);

		bbq.lang.Watchable.registerGlobalListener("onUpdatedServerPreferences", this._serverPreferencesUpdated.bind(this))

		if(!Preferences.get(BIGBOARD_PREFERENCES.SERVER)) {
			this._header.showServerPreferences();
		} else {
			this._serverPreferencesUpdated();
		}
	},

	_serverPreferencesUpdated: function() {
		try {
			var system = bigboard.ticketsystems[Preferences.get(BIGBOARD_PREFERENCES.SYSTEM)];

			if(system == null) {
				Log.warn("Could not get ticket system from preference.  Stored value: " + Preferences.get(BIGBOARD_PREFERENCES.SYSTEM));
			}

			this._ticketSystem = new system({
				url: Preferences.get(BIGBOARD_PREFERENCES.SERVER),
				token: Preferences.get(BIGBOARD_PREFERENCES.TOKEN)
			});
			this._ticketSystem.getMilestoneList(this._gotMilestoneList.bind(this));

			if(this._ticketBoard == null) {
				this._ticketBoard = new bigboard.gui.tickets.TicketBoard({
					ticketSystem: this._ticketSystem
				});
				this._ticketBoard.appendTo(document.body);
			} else {
				this._ticketBoard.options.ticketSystem = this._ticketSystem;
			}

			} catch(e) {
			Log.error("huh?", e);
		}
	},

	_gotMilestoneList: function(milestones) {
		this._header.showMilestones(milestones);
	}
});
