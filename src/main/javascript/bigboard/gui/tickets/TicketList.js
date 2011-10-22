include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.tickets.TicketSummary);
include(bigboard.gui.tickets.FreeTicketSpot);
include(bbq.gui.DragAndDrop);

bigboard.gui.tickets.TicketList = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketList");

			DragAndDropManager.makeDropTarget(this);
		} catch(e) {
			Log.error("Error constructing TicketList", e);
		}
	},

	dropTargetWillAccept: function(draggable) {
		if(this.options.max) {
			if(this.options.tickets.length >= this.options.max) {
				// do not accept tickets when we are over capacity
				return false;
			}
		}

		if(draggable instanceof bigboard.gui.tickets.TicketSummary) {
			var ticket = draggable.getTicket();

			if(this.options.tickets.indexOf(ticket) != -1) {
				// ticket is already in this list
				return false;
			}

			if(this.options.accepts.length == 0) {
				// accept tickets of any type
				return true;
			}

			if(this.options.accepts.indexOf(ticket.getStatus()) != -1) {
				// we only accept tickets of certain types - make sure that
				// the incoming ticket is of that type
				return true;
			}

			return false;
		}

		return false;

		//return draggable instanceof bigboard.gui.tickets.TicketSummary;
	},

	dropTargetEnter: function(ticketSummary) {
		this.addClass("TicketList_over");
	},

	dropTargetLeave: function(ticketSummary) {
		this.removeClass("TicketList_over");
	},

	dropTargetDropped: function(ticketSummary) {
		this.removeClass("TicketList_over");

		var ticket = ticketSummary.getTicket();
		var otherList = ticketSummary.getList();

		// remove ticket from other list
		var otherTicketList = otherList.getTickets();
		var index = otherTicketList.indexOf(ticket);
		otherTicketList.splice(index, 1);

		ticket.setStatus(this.options.status);

		// add it to our list
		this.options.tickets.push(ticket);

		// redraw
		otherList.render();
		this.render();

		currentPage.server.setTicketStatus(ticket, this.options.after, this.options.board.render.bind(this.options.board));
	},

	render: function($super) {
		$super();

		this.empty();

		// sort by ticket id ascending
		this.options.tickets.sort(function(a, b) {
			return a.getId() - b.getId();
		});

		if(this.options.max) {
			this.appendChild(DOMUtil.createElement("h4",
				this.options.tickets.length + "/" + this.options.max, {
				className: "capacity " + (this.options.tickets.length > this.options.max ? "no_capacity" : "")
			}));
		}

		this.appendChild(DOMUtil.createElement("h3", this.options.name));

		this.options.tickets.each(function(ticket) {
			this.appendChild(new bigboard.gui.tickets.TicketSummary({ticket: ticket, list: this}));
		}.bind(this));

		if(this.options.max) {
			for(var i = this.options.tickets.length; i < this.options.max; i++) {
				this.appendChild(new bigboard.gui.tickets.FreeTicketSpot());
			}
		} else {
			// show an empty slot
			this.appendChild(new bigboard.gui.tickets.FreeTicketSpot());
		}
	},

	getTickets: function() {
		return this.options.tickets;
	}
});
