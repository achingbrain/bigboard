include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);

bigboard.gui.tickets.TicketSummary = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketSummary");
			this.addClass("TicketSummary_status_" + this.options.ticket.getStatus());
			this.addClass("TicketSummary_status_" + this.options.ticket.getStatus());
		} catch(e) {
			Log.error("Error constructing TicketSummary", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this.appendChild(DOMUtil.createElement("h4", this.options.ticket.getSummary().truncate(40)));
	}
});
