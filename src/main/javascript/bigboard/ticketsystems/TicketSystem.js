
/**
 * Provides an Interface for all ticket system providers
 */
bigboard.ticketsystems.TicketSystem = new Class.create({
	_url: null,
	_token: null,

	initialize: function(args) {
		try {

			if(args) {
				this._url = args.url;
				this._token = args.token;
			}
		} catch(e) {
			Log.error("Error constructing Provider", e);
		}
	},

	testConnection: function(url, username, password, onSuccess, onFailure, onAuthenticationNeeded) {
		
	},

	getTicketSystemName: function() {

	},

	getMilestoneList: function(onComplete, onError) {

	},

	getMilestone: function(name, onComplete, onError) {

	},

	getTicketList: function(milestone, onComplete, onError) {

	},

	getLinkToTicket: function(ticket) {

	},

	getLinkToReporter: function(reporter) {

	},

	setTicketStatus: function(ticket, status, onComplete, onError) {
		
	}
});
