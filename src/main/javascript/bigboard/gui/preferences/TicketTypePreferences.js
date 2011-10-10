include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.gui.form.TextField);
include(bbq.gui.form.DropDown);
include(bbq.gui.button.NativeButton);

bigboard.gui.preferences.TicketTypePreferences = new Class.create(bbq.gui.GUIWidget, {
	_tbody: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TicketTypePreferences");

		} catch(e) {
			Log.error("Error constructing TicketTypePreferences", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		var table = DOMUtil.createElement("table", [
			DOMUtil.createElement("thead", [
				DOMUtil.createElement("tr", [
					DOMUtil.createElement("th", Language.get("tickettypes.type")),
					DOMUtil.createElement("th", Language.get("tickettypes.colour")),
					DOMUtil.createElement("th", " ")
				])
			])
		]);
		this._tbody = DOMUtil.createElement("tbody");
		table.appendChild(this._tbody);

		this.options.server.getTicketTypes().each(function(ticket) {
			this._tbody.appendChild(DOMUtil.createElement("tr", [
				DOMUtil.createElement("td", ticket.type),
				DOMUtil.createElement("td", ticket.colour),
				DOMUtil.createElement("td", new bbq.gui.button.NativeButton({
					text: Language.get("tickettypes.delete"),
					onClick: this._removeTicketType.bind(this, ticket)
				}))
			]));
		}.bind(this));

		this.appendChild(DOMUtil.createElement("p", Language.get("tickettypes.types")));
		this.appendChild(table);
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("tickettypes.add"),
			onClick: this._addUserOverride.bind(this)
		}));
	},

	_addUserOverride: function() {
		var typeField = new bbq.gui.form.TextField();
		var colourField = new bbq.gui.form.DropDown({
			options: [
				{key: Language.get("tickettypes.default"), value: "default"},
				{key: Language.get("tickettypes.green"), value: "green"},
				{key: Language.get("tickettypes.yellow"), value: "yellow"},
				{key: Language.get("tickettypes.red"), value: "red"},
				{key: Language.get("tickettypes.orange"), value: "orange"},
				{key: Language.get("tickettypes.blue"), value: "blue"}
			]
		});

		this._tbody.appendChild(DOMUtil.createElement("tr", [
			DOMUtil.createElement("td", typeField),
			DOMUtil.createElement("td", colourField),
			DOMUtil.createElement("td", new bbq.gui.button.NativeButton({
				text: Language.get("tickettypes.save"),
				onClick: function() {
					if (!typeField.getValue()) {
						return;
					}

					this.options.server.getTicketTypes().push({
						type: typeField.getValue(),
						colour: colourField.getValue()
					});
					this.render();
				}.bind(this)
			}))
		]));
	},

	_removeTicketType: function(ticket) {
		this.options.server.setTicketTypes(this.options.server.getTicketTypes().without(ticket));
		this.render();
	}
});
