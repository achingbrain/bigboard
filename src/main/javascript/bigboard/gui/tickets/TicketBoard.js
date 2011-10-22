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

		// used to set dynamic width when we are not filtering ticket statuses
		var numGroups = 0;

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
				numGroups++;
			}

			groups[ticket.getStatus()].push(ticket);
		});

		if(filter) {
			var width = 100 / currentPage.server.getTicketStatuses().length;
			width -= 3;

			currentPage.server.getTicketStatuses().each(function(status) {
				this.appendChild(new bigboard.gui.tickets.TicketList({
					name: status.title,
					max: status.max,
					accepts: status.accepts,
					after: status.after,
					tickets: groups[status.status],
					status: status.status,
					board: this,
					attributes: {
						style: {
							width: width + "%"
						}
					}
				}));
			}.bind(this));
		} else {
			var width = 100 / numGroups;

			for(var status in groups) {
				this.appendChild(new bigboard.gui.tickets.TicketList({
					name: status.title,
					max: status.max,
					accepts: status.accepts,
					after: status.after,
					tickets: groups[status.status],
					status: status.status,
					board: this,
					attributes: {
						style: {
							width: width + "%"
						}
					}
				}));
			}
		}
	}
});
