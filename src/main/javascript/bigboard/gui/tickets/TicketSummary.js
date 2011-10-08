include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);
include(bbq.gui.button.GUIButton);
include(bigboard.gui.Avatar);

bigboard.gui.tickets.TicketSummary = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketSummary");
			this.addClass("TicketSummary_status_" + this.options.ticket.getStatus());
			this.addClass("TicketSummary_type_" + this.options.ticket.getType().replace(" ", "_"));
		} catch(e) {
			Log.error("Error constructing TicketSummary", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this.appendChild(new bigboard.gui.Avatar({
			user: this.options.ticket.getOwner(),
			size: 16
		}));
		this.appendChild(DOMUtil.createElement("h5", "#" + this.options.ticket.getId()));
		this.appendChild(DOMUtil.createElement("h6", this.options.ticket.getReported().getDate() + "/" + (this.options.ticket.getReported().getMonth() + 1) + "/" + this.options.ticket.getReported().getFullYear()));
		this.appendChild(DOMUtil.createElement("h4", this.options.ticket.getSummary().truncate(40)));
	}
});
