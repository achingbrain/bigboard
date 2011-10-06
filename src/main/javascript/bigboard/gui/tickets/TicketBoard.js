include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.lang.Watchable);
include(bbq.gui.LoadingNotification);
include(bigboard.gui.tickets.TicketList);

bigboard.gui.tickets.TicketBoard = new Class.create(bbq.gui.GUIWidget, {
	_loadingTickets: null,
	_tickets: [],
	_ticketSystem: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketBoard");

			bbq.lang.Watchable.registerGlobalListener("onMilestoneSelected", this._milestoneSelected.bind(this));
		} catch(e) {
			Log.error("Error constructing Error", e);
		}
	},

	_milestoneSelected: function(sender, milestone) {
		this._loadingTickets = true;
		this.render();

		this.options.ticketSystem.getTicketList(milestone, this._loadedTickets.bind(this))
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

		this._tickets.each(function(ticket) {
			if(!groups[ticket.getStatus()]) {
				groups[ticket.getStatus()] = [];
			}

			groups[ticket.getStatus()].push(ticket);
		});

		for(var key in groups) {
			this.appendChild(new bigboard.gui.tickets.TicketList({
				name: key,
				tickets: groups[key]
			}));
		}
	}
});
