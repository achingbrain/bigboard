include(bigboard.ticketsystems.TicketSystem);
include(bbq.ajax.ForwardingJSONRequest);
include(bigboard.domain.Milestone);
include(bigboard.domain.Ticket);
include(bbq.util.PersistenceUtil);

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
							//this._descapeResponse(result);

							PersistenceUtil.deserialize(result);

							var ticket = new bigboard.domain.Ticket();
							ticket.setId(result[0]);
							ticket.getLastUpdated(result[1]);
							ticket.setStatus(result[3]["status"]);
							ticket.setReported(result[2]);
							ticket.setDescription(result[3]["description"]);
							ticket.setReporter(result[3]["reporter"]);
							ticket.setResolution(result[3]["resolution"]);
							ticket.setCC(result[3]["cc"]);
							ticket.setComponent(result[3]["component"]);
							ticket.setSummary(result[3]["summary"]);
							ticket.setPriority(result[3]["priority"]);
							ticket.setKeywords(result[3]["keywords"]);
							ticket.setMilestone(result[3]["milestone"]);
							ticket.setOwner(result[3]["owner"]);
							ticket.setType(result[3]["type"]);
							ticket.setSevertiy(result[3]["severity"]);

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

	wikiToHtml: function(text, onComplete, onError) {
		new bbq.ajax.ForwardingJSONRequest({
			url: this._url + "/login/jsonrpc",
			args: {
				method: "wiki.wikiToHtml",
				params: [
					text
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
	}
});
