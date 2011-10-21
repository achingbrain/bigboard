include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);
include(bbq.gui.button.GUIButton);
include(bigboard.gui.Avatar);
include(bigboard.gui.tickets.TicketDetail);
include(bbq.date.DateFormatter);
include(bigboard.gui.DragAndDrop);

bigboard.gui.tickets.TicketSummary = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketSummary");

			DragAndDropManager.makeDraggable(this);

			currentPage.server.getTicketTypes().each(function(type) {
				if(type.type == this.options.ticket.getType()) {
					this.addClass("TicketSummary_type_" + type.colour);
				}
			}.bind(this));

			this.getRootNode().onclick = function() {
				var detail = new bigboard.gui.tickets.TicketDetail({ticket: this.options.ticket});
				currentPage.addModalLayer(detail);
			}.bind(this)
		} catch(e) {
			Log.error("Error constructing TicketSummary", e);
		}
	},

	draggableStarted: function() {
		this.setStyle("opacity", 0.4);
	},

	draggableStopped: function() {
		this.setStyle("opacity", 1);
	},

	render: function($super) {
		$super();

		this.empty();

		if(currentPage.server.getBacklogUser() != this.options.ticket.getOwner()) {
			this.appendChild(new bigboard.gui.Avatar({
				user: this.options.ticket.getOwner(),
				size: 16
			}));
		}

		this.appendChild(DOMUtil.createElement("h5", "#" + this.options.ticket.getId()));
		this.appendChild(DOMUtil.createElement("time", DateFormatter.format(this.options.ticket.getReported(), "dd/mm/yyyy")));
		this.appendChild(DOMUtil.createElement("h4", this.options.ticket.getSummary().truncate(40)));
	}
});
