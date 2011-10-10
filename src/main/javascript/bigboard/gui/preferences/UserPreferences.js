include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.gui.form.TextField);
include(bbq.gui.form.EmailField);
include(bbq.gui.button.NativeButton);

bigboard.gui.preferences.UserPreferences = new Class.create(bbq.gui.GUIWidget, {
	_tbody: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("UserPreferences");
		} catch(e) {
			Log.error("Error constructing UserPreferences", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		this.appendChild(DOMUtil.createElement("label", [
			DOMUtil.createElement("p", Language.get("userpreferences.avataroverrideurl")),
			new bbq.gui.form.TextField({
				value: this.options.server.getGlobalAvatarOverrideUrl(),
				onChange: function(field) {
					this.options.server.setGlobalAvatarOverrideUrl(field.getValue());
				}.bind(this)
			})
		]));

		this.appendChild(DOMUtil.createElement("label", [
			DOMUtil.createElement("p", Language.get("userpreferences.backloguser")),
			new bbq.gui.form.TextField({
				value: this.options.server.getBacklogUser(),
				onChange: function(field) {
					this.options.server.setBacklogUser(field.getValue());
				}.bind(this)
			})
		]));

		var table = DOMUtil.createElement("table", [
			DOMUtil.createElement("thead", [
				DOMUtil.createElement("tr", [
					DOMUtil.createElement("th", Language.get("userpreferences.username")),
					DOMUtil.createElement("th", Language.get("userpreferences.emailaddress")),
					DOMUtil.createElement("th", " ")
				])
			])
		]);
		this._tbody = DOMUtil.createElement("tbody");
		table.appendChild(this._tbody);
		
		this.options.server.getUsers().each(function(user) {
			this._tbody.appendChild(DOMUtil.createElement("tr", [
				DOMUtil.createElement("td", user.name),
				DOMUtil.createElement("td", user.email),
				DOMUtil.createElement("td", new bbq.gui.button.NativeButton({
					text: Language.get("userpreferences.delete"),
					onClick: this._removeUserOverride.bind(this, user)
				}))
			]));
		}.bind(this));

		this.appendChild(DOMUtil.createElement("p", Language.get("userpreferences.users")));
		this.appendChild(table);
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("userpreferences.add"),
			onClick: this._addUserOverride.bind(this)
		}));
	},

	_addUserOverride: function() {
		var nameField = new bbq.gui.form.TextField();
		var emailField = new bbq.gui.form.EmailField();

		this._tbody.appendChild(DOMUtil.createElement("tr", [
			DOMUtil.createElement("td", nameField),
			DOMUtil.createElement("td", emailField),
			DOMUtil.createElement("td", new bbq.gui.button.NativeButton({
				text: Language.get("userpreferences.save"),
				onClick: function() {
					if(!nameField.getValue() || !emailField.getValue()) {
						return;
					}

					this.options.server.getUsers().push({
						name: nameField.getValue(),
						email: emailField.getValue()
					});
					this.render();
				}.bind(this)
			}))
		]));
	},

	_removeUserOverride: function(user) {
		this.options.server.setUsers(this.options.server.getUsers().without(user));
		this.render();
	}
});
