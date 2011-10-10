include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);
include(bigboard.gui.tickets.TicketList);

bigboard.gui.tickets.TicketBoard = new Class.create(bbq.gui.GUIWidget, {
	_loadingTickets: null,
	_tickets: [],

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketBoard");

			this._loadingTickets = true;
		} catch(e) {
			Log.error("Error constructing Error", e);
		}
	},

	milestoneSelected: function(milestone) {
		this._loadingTickets = true;
		this.render();

		currentPage.server.getTicketList(milestone, this._loadedTickets.bind(this))
	},

	_loadedTickets: function(tickets) {
		this._loadingTickets = false;
		this._tickets = tickets;
		this.render();
	},

	render: function($super) {
		$super();

		this.empty();

		if(this._loadingTickets) {
			this.appendChild(new bbq.gui.LoadingNotification());

			return;
		}

		if(this._tickets.length == 0) {
			this.appendChild(DOMUtil.createElement("p", Language.get("ticketboard.noticket"), {className: "no_ticket"}));

			return;
		}

		// sort tickets into groups
		var groups = {};
		var filter = false;

		if(currentPage.server.getTicketStatuses().length > 0) {
			filter = true;

			currentPage.server.getTicketStatuses().each(function(status) {
				groups[status.status] = [];
			});
		}

		this._tickets.each(function(ticket) {
			if(Object.isUndefined(groups[ticket.getStatus()])) {
				if(filter) {
					return;
				}

				groups[ticket.getStatus()] = [];
			}

			groups[ticket.getStatus()].push(ticket);
		});

		if(filter) {
			currentPage.server.getTicketStatuses().each(function(status) {
				this.appendChild(new bigboard.gui.tickets.TicketList({
					name: status.title,
					max: status.max,
					tickets: groups[status.status]
				}));
			}.bind(this));
		} else {
			for(var status in groups) {
				this.appendChild(new bigboard.gui.tickets.TicketList({
					name: status,
					tickets: groups[status]
				}));
			}
		}
	}
});
