include(bigboard.page.Page);
include(bigboard.gui.header.Header);
include(bbq.web.Preferences);
include(bbq.lang.Watchable);
include(bigboard.gui.tickets.TicketBoard);

BIGBOARD_PREFERENCES = {
	SERVER_LIST: "SERVER_LIST",
	LAST_SELECTED_SERVER: "LAST_SELECTED_SERVER",
	LAST_SELECTED_MILESTONE: "LAST_SELECTED_MILESTONE"
}

bigboard.page.Home = new Class.create(bigboard.page.Page, {
	server: null,
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

		bbq.lang.Watchable.registerGlobalListener("onUpdatedServerPreferences", this._showServer.bind(this));
		bbq.lang.Watchable.registerGlobalListener("onServerSelected", this._showServer.bind(this));
		bbq.lang.Watchable.registerGlobalListener("onMilestoneSelected", this._milestoneSelected.bind(this));

		var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);

		if(!servers || servers.length == 0) {
			this._header.showServerPreferences();
		} else {
			this._showServer();
		}
	},

	_showServer: function() {
		try {
			var servers = Preferences.get(BIGBOARD_PREFERENCES.SERVER_LIST, []);
			var index = Preferences.get(BIGBOARD_PREFERENCES.LAST_SELECTED_SERVER, 0);

			if(index >= servers.length) {
				index = 0;
			}

			currentPage.server = servers[index];
			currentPage.server.getMilestoneList(this._gotMilestoneList.bind(this));

			if(this._ticketBoard != null) {
				document.body.removeChild(this._ticketBoard.getRootNode());
			}

			this._ticketBoard = new bigboard.gui.tickets.TicketBoard();
			this._ticketBoard.appendTo(document.body);
		} catch(e) {
			Log.error("Error showing server", e);
		}
	},

	_gotMilestoneList: function(milestones) {
		this._header.showMilestones(milestones);
	},

	_milestoneSelected: function(sender, milestones) {
		this._ticketBoard.milestoneSelected(milestones);
	}
});
