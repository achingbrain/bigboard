include(bbq.web.Persistable);

/**
 * Holds details about individual servers
 */
bigboard.Server = new Class.create(bbq.web.Persistable, {
	_ticketSystem: null,
	
	initialize: function(args) {
		try {
			this._settings = args && args.settings ? args.settings : {};

			// holds details about tickets
			if(!this._settings["ticket_types"]) {
				this._settings["ticket_types"] = [];
			}

			// holds details about tickets
			if (!this._settings["ticket_statuses"]) {
				this._settings["ticket_statuses"] = [];
			}

			// holds details about remote users
			if(!this._settings["users"]) {
				this._settings["users"] = [];
			}
		} catch(e) {
			Log.error("Error constructing Provider", e);
		}
	},

	_getArgs: function() {
		return {settings: this._settings};
	},

	getName: function() {
		return this._settings["name"];
	},

	setName: function(name) {
		this._settings["name"] = name;
	},

	getUrl: function() {
		return this._settings["url"];
	},

	setUrl: function(url) {
		this._settings["url"] = url;
	},

	getToken: function() {
		return this._settings["token"];
	},

	setToken: function(token) {
		this._settings["token"] = token;
	},

	getSystem: function() {
		return this._settings["system"];
	},

	setSystem: function(system) {
		this._settings["system"] = system;
	},

	getLastSelectedMilestone: function() {
		return this._settings["last_selected_milestone"];
	},

	setLastSelectedMilestone: function(milestone) {
		this._settings["last_selected_milestone"] = milestone;
	},

	getTicketTypes: function() {
		return this._settings["ticket_types"];
	},

	setTicketTypes: function(ticketTypes) {
		this._settings["ticket_types"] = ticketTypes;
	},

	getTicketStatuses: function() {
		return this._settings["ticket_statuses"];
	},

	setTicketStatuses: function(ticketStatuses) {
		this._settings["ticket_statuses"] = ticketStatuses;
	},

	getBacklogUser: function() {
		return this._settings["backlog_user"];
	},

	setBacklogUser: function(backlogUser) {
		this._settings["backlog_user"] = backlogUser;
	},

	getGlobalAvatarOverrideUrl: function() {
		return this._settings["global_avatar_override_url"];
	},

	setGlobalAvatarOverrideUrl: function(url) {
		this._settings["global_avatar_override_url"] = url;
	},

	getUsers: function() {
		return this._settings["users"];
	},

	setUsers: function(users) {
		this._settings["users"] = users;
	},

	_getTicketSystem: function() {
		if(this._ticketSystem == null) {
			var system = BBQUtil.findClass(this.getSystem());
			
			this._ticketSystem = new system({
				url: this.getUrl(),
				token: this.getToken()
			});
		}

		return this._ticketSystem;
	},

	getTicketSystemName: function() {
		return this._getTicketSystem().getTicketSystemName();
	},

	getMilestoneList: function(onComplete, onError) {
		this._getTicketSystem().getMilestoneList(onComplete, onError);
	},

	getMilestone: function(name, onComplete, onError) {
		this._getTicketSystem().getMilestone(name, onComplete, onError);
	},

	getTicketList: function(milestone, onComplete, onError) {
		this._getTicketSystem().getTicketList(milestone, onComplete, onError);
	},

	getLinkToTicket: function(ticket) {
		return this._getTicketSystem().getLinkToTicket(ticket);
	},

	getLinkToReporter: function(reporter) {
		return this._getTicketSystem().getLinkToReporter(reporter);
	},

	wikiToHtml: function(text, onComplete, onError) {
		return this._getTicketSystem().wikiToHtml(text, onComplete, onError);
	}
});
