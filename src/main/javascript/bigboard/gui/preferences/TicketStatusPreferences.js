include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.gui.form.TextField);
include(bbq.gui.button.NativeButton);
include(bbq.gui.form.transformer.StringTokeniserTransformer);

bigboard.gui.preferences.TicketStatusPreferences = new Class.create(bbq.gui.GUIWidget, {
	_tbody: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketStatusPreferences");

		} catch(e) {
			Log.error("Error constructing TicketStatusPreferences", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		var table = DOMUtil.createElement("table", [
			DOMUtil.createElement("thead", [
				DOMUtil.createElement("tr", [
					DOMUtil.createElement("th", Language.get("ticketstatuses.status")),
					DOMUtil.createElement("th", Language.get("ticketstatuses.title")),
					DOMUtil.createElement("th", Language.get("ticketstatuses.max")),
					DOMUtil.createElement("th", Language.get("ticketstatuses.accepts")),
					DOMUtil.createElement("th", Language.get("ticketstatuses.thenstatus")),
					DOMUtil.createElement("th", " ")
				])
			])
		]);
		this._tbody = DOMUtil.createElement("tbody");
		table.appendChild(this._tbody);

		this.options.server.getTicketStatuses().each(function(ticket) {
			this._tbody.appendChild(DOMUtil.createElement("tr", [
				DOMUtil.createElement("td", ticket.status),
				DOMUtil.createElement("td", ticket.title),
				DOMUtil.createElement("td", ticket.max),
				DOMUtil.createElement("td", ticket.accepts ? ticket.accepts.join(", ").strip() : ""),
				DOMUtil.createElement("td", ticket.after),
				DOMUtil.createElement("td", new bbq.gui.button.NativeButton({
					text: Language.get("ticketstatuses.delete"),
					onClick: this._removeTicketStatus.bind(this, ticket)
				}))
			]));
		}.bind(this));

		this.appendChild(DOMUtil.createElement("p", Language.get("ticketstatuses.types")));
		this.appendChild(table);
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("ticketstatuses.add"),
			onClick: this._addUserOverride.bind(this)
		}));
	},

	_addUserOverride: function() {
		var statusField = new bbq.gui.form.TextField();
		var titleField = new bbq.gui.form.TextField();
		var maxField = new bbq.gui.form.TextField();
		var acceptsField = new bbq.gui.form.TextField({
			valueTransformer: new bbq.gui.form.transformer.StringTokeniserTransformer()
		});
		var afterField = new bbq.gui.form.TextField();

		this._tbody.appendChild(DOMUtil.createElement("tr", [
			DOMUtil.createElement("td", statusField),
			DOMUtil.createElement("td", titleField),
			DOMUtil.createElement("td", maxField),
			DOMUtil.createElement("td", acceptsField),
			DOMUtil.createElement("td", afterField),
			DOMUtil.createElement("td", new bbq.gui.button.NativeButton({
				text: Language.get("ticketstatuses.save"),
				onClick: function() {
					if (!statusField.getValue() || !titleField.getValue()) {
						return;
					}

					this.options.server.getTicketStatuses().push({
						status: statusField.getValue(),
						title: titleField.getValue(),
						max: maxField.getValue(),
						accepts: acceptsField.getValue(),
						after: afterField.getValue()
					});
					this.render();
				}.bind(this)
			}))
		]));
	},

	_removeTicketStatus: function(status) {
		this.options.server.setTicketStatuses(this.options.server.getTicketStatuses().without(status));
		this.render();
	}
});
