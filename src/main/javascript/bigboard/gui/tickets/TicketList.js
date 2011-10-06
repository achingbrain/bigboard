include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.tickets.TicketSummary);

bigboard.gui.tickets.TicketList = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketList");
		} catch(e) {
			Log.error("Error constructing TicketList", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this.appendChild(DOMUtil.createElement("h3", this.options.name));

		this.options.tickets.each(function(ticket) {
			this.appendChild(new bigboard.gui.tickets.TicketSummary({ticket: ticket}));
		}.bind(this));
	}
});
