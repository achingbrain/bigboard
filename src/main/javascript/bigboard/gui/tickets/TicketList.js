include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.tickets.TicketSummary);
include(bigboard.gui.tickets.FreeTicketSpot);

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

		if(this.options.max) {
			this.appendChild(DOMUtil.createElement("h4",
				this.options.tickets.length + "/" + this.options.max, {
				className: "capacity " + (this.options.tickets.length > this.options.max ? "no_capacity" : "")
			}));
		}

		this.appendChild(DOMUtil.createElement("h3", this.options.name));

		this.options.tickets.each(function(ticket) {
			this.appendChild(new bigboard.gui.tickets.TicketSummary({ticket: ticket}));
		}.bind(this));

		if(this.options.max) {
			for(var i = this.options.tickets.length; i < this.options.max; i++) {
				this.appendChild(new bigboard.gui.tickets.FreeTicketSpot());
			}
		}
	}
});
