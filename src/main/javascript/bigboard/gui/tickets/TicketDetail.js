include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);
include(bbq.gui.button.GUIButton);
include(bigboard.gui.Avatar);
include(bbq.date.DateFormatter);

bigboard.gui.tickets.TicketDetail = new Class.create(bbq.gui.GUIWidget, {
	_ticketDescription: null,

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

		this.appendChild(
				DOMUtil.createElement("h5", [
					"#" + this.options.ticket.getId(),
					DOMUtil.createElement("a", Language.getFormatted("ticketdetail.view", {system: currentPage.server.getTicketSystemName()}), {
						href: currentPage.server.getLinkToTicket(this.options.ticket)
					})
				])
		);

		this.appendChild(DOMUtil.createElement("time",
				Language.getFormatted("ticketdetail.reported", {
					reporter: DOMUtil.createElement("a", this.options.ticket.getReporter(), {
						href: currentPage.server.getLinkToReporter(this.options.ticket.getReporter())
					}),
					date: DateFormatter.format(this.options.ticket.getReported(), "dd/mm/yyyy")
				}), {
					datetime: this.options.ticket.getReported()
				}
		));

		this.appendChild(DOMUtil.createElement("h4", this.options.ticket.getSummary()));
		this.appendChild(this.options.ticket.getDescriptionDisplay());
	}
});
