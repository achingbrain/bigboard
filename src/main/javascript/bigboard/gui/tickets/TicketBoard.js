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

		// sort tickets into groups
		var groups = {};

		currentPage.server.getTicketStatuses().each(function(status) {
			groups[status.status] = [];
		});

		this._tickets.each(function(ticket) {
			if(!groups[ticket.getStatus()]) {
				return;
			}

			groups[ticket.getStatus()].push(ticket);
		});

		currentPage.server.getTicketStatuses().each(function(status) {
			this.appendChild(new bigboard.gui.tickets.TicketList({
				name: status.title,
				max: status.max,
				tickets: groups[status.status]
			}));
		}.bind(this));
	}
});
