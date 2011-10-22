include(bigboard.ticketsystems.TicketSystem);
include(bbq.ajax.ForwardingJSONRequest);
include(bigboard.domain.Milestone);
include(bigboard.domain.Ticket);
include(bbq.util.PersistenceUtil);
include(bbq.date.DateFormatter);

bigboard.ticketsystems.Trac = new Class.create(bigboard.ticketsystems.TicketSystem, {

	testConnection: function($super, onSuccess, onFailure, onAuthenticationNeeded) {
		this.getMilestoneList(function(milestones) {
				if(!milestones) {
					onFailure();
				} else {
					onSuccess();
				}
			},
			function(serverResponse) {
				var code = serverResponse.transport.getResponseHeader("X-BBQ-Remote-ResponseCode");

				if (code == 401) {
					onAuthenticationNeeded();
				} else {
					onFailure();
				}
			}
		);
	},

	getTicketSystemName: function() {
		return Language.get("trac.name");
	},

	getMilestoneList: function($super, onComplete, onError) {
		new bbq.ajax.ForwardingJSONRequest({
			url: this._url + "/login/jsonrpc",
			args: {
				method: "ticket.milestone.getAll"
			},
			headers: {
				Authorization: "Basic " + this._token
			},
			onSuccess: function(serverResponse, json) {
				onComplete((json && json.result) ? json.result : null);
			},
			onFailure: onError
		});
	},

	getMilestone: function(name, onComplete, onError) {
		new bbq.ajax.ForwardingJSONRequest({
			doNotEscapeArgs: true,
			url: this._url + "/login/jsonrpc",
			args: {
				method: "ticket.milestone.get",
				params: [
					name
				]
			},
			headers: {
				Authorization: "Basic " + this._token
			},
			onSuccess: function(serverResponse, json) {
				if(!json || json.error) {
					if(onError) {
						onError();
					}

					return;
				}

				if(!onComplete) {
					return;
				}

				//this._descapeResponse(json.result);
				PersistenceUtil.deserialize(json.result);

				var milestone = new bigboard.domain.Milestone();
				milestone.setName(name);
				milestone.setDescription(json.result.description);
				milestone.setDue(json.result.due);
				milestone.setCompleted(json.result.completed);

				onComplete(milestone);
			},
			onFailure: onError
		}.bind(this));
	},

	getTicketList: function($super, milestone, onComplete, onError) {
		new bbq.ajax.ForwardingJSONRequest({
			doNotEscapeArgs: true,
			url: this._url + "/login/jsonrpc",
			args: {
				method: "ticket.query",
				params: [
					"milestone=" + milestone
				]
			},
			headers: {
				Authorization: "Basic " + this._token
			},
			onSuccess: function(serverResponse, json) {
				if (!json || json.error) {
					if (onError) {
						onError();
					}

					return;
				}

				var args = [];

				json.result.each(function(ticket) {
					args.push({
						method: "ticket.get",
						params: [
							ticket]
					});
				})

				new bbq.ajax.ForwardingJSONRequest({
					doNotEscapeArgs: true,
					url: this._url + "/login/jsonrpc",
					args: {
						method: "system.multicall",
						params: args
					},
					headers: {
						Authorization: "Basic " + this._token
					},
					onSuccess: function(serverResponse, json) {
						if (!json || json.error) {
							if (onError) {
								onError();
							}

							return;
						}

						if(!onComplete) {
							return;
						}

						var tickets = [];

						json.result.each(function(result) {
							result = result.result;

							var ticket = new bigboard.domain.Ticket();

							this._updateTicket(ticket, result);

							tickets.push(ticket);
						}.bind(this));

						onComplete(tickets);
					}.bind(this),
					onFailure: onError
				});
			}.bind(this),
			onFailure: onError
		});
	},

	getLinkToTicket: function(ticket) {
		return currentPage.server.getUrl() + "/ticket/" + ticket.getId();
	},

	getLinkToReporter: function(reporter) {
		return currentPage.server.getUrl() + "/query?status=!closed&reporter=" + reporter;
	},

	loadData: function(ticket, onComplete, onError) {
		new bbq.ajax.ForwardingJSONRequest({
			url: this._url + "/login/jsonrpc",
			args: {
				method: "wiki.wikiToHtml",
				params: [
					ticket.getDescription()
				]
			},
			headers: {
				Authorization: "Basic " + this._token
			},
			onSuccess: function(serverResponse, json) {
				onComplete((json && json.result) ? json.result : null);
			},
			onFailure: onError
		});
	},

	setTicketStatus: function(ticket, status, onComplete, onError) {
		new bbq.ajax.ForwardingJSONRequest({
			url: this._url + "/login/jsonrpc",
			args: {
				method: "ticket.update",
				params: [
					ticket.getId(), "", {
						action: status,
						_ts: {"__jsonclass__": ["datetime", DateFormatter.format(new Date(), DateFormatter.masks.isoDateTime)]}
					}, false, currentPage.server.getUser()
				]
			},
			headers: {
				Authorization: "Basic " + this._token
			},
			onSuccess: function(serverResponse, json) {
				this._updateTicket(ticket, json.result);

				onComplete((json && json.result) ? json.result : null);
			}.bind(this),
			onFailure: onError
		});
	},

	_updateTicket: function(ticket, data) {
		PersistenceUtil.deserialize(data);

		ticket.setId(data[0]);
		ticket.getLastUpdated(data[1]);
		ticket.setStatus(data[3]["status"]);
		ticket.setReported(data[2]);
		ticket.setDescription(data[3]["description"]);
		ticket.setReporter(data[3]["reporter"]);
		ticket.setResolution(data[3]["resolution"]);
		ticket.setCC(data[3]["cc"]);
		ticket.setComponent(data[3]["component"]);
		ticket.setSummary(data[3]["summary"]);
		ticket.setPriority(data[3]["priority"]);
		ticket.setKeywords(data[3]["keywords"]);
		ticket.setMilestone(data[3]["milestone"]);
		ticket.setOwner(data[3]["owner"]);
		ticket.setType(data[3]["type"]);
		ticket.setSevertiy(data[3]["severity"]);
	}
});
