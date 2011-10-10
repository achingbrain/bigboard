include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);
include(bbq.gui.button.GUIButton);
include(bigboard.gui.Avatar);

bigboard.gui.tickets.TicketDetail = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketDetail");

			currentPage.server.getTicketTypes().each(function(type) {
				if (type.type == this.options.ticket.getType()) {
					this.addClass("TicketDetail_type_" + type.colour);
				}
			}.bind(this));
		} catch(e) {
			Log.error("Error constructing TicketSummary", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this.appendChild(new bbq.gui.button.GUIButton({
			text: Language.get("ticketdetail.close"),
			toolTip: Language.get("ticketdetail.close"),
			onClick: function() {
				currentPage.clearModalLayer();
			},
			attributes: {
				className: "close_button"
			}
		}));

		if (currentPage.server.getBacklogUser() != this.options.ticket.getOwner()) {
			this.appendChild(new bigboard.gui.Avatar({
				user: this.options.ticket.getOwner(),
				size: 80
			}));
		}

		this.appendChild(DOMUtil.createElement("h5", "#" + this.options.ticket.getId()));
		this.appendChild(DOMUtil.createElement("h6", this.options.ticket.getReported().getDate() + "/" + (this.options.ticket.getReported().getMonth() + 1) + "/" + this.options.ticket.getReported().getFullYear()));
		this.appendChild(DOMUtil.createElement("h4", this.options.ticket.getSummary()));
		this.appendChild(DOMUtil.createElement("p", this.options.ticket.getDescription()));
	}
});
