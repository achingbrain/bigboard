include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bbq.gui.form.TextField);
include(bbq.gui.form.PasswordField);
include(bbq.gui.form.DropDown);
include(bbq.gui.form.URLField);
include(bbq.ajax.ForwardingJSONRequest);
include(bbq.gui.LoadingNotification);
include(bbq.gui.form.CheckBox);
include(bigboard.ticketsystems.Trac);

bigboard.gui.preferences.AccessPreferences = new Class.create(bbq.gui.GUIWidget, {
	_nameField: null,
	_urlField: null,
	_typeField: null,
	_testButton: null,
	_userNameField: null,
	_passwordField: null,
	_userDetails: false,
	_loadingNotification: null,
	_message: null,
	_testingSettings: false,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("AccessPreferences");

			this._nameField = new bbq.gui.form.TextField({
				value: this.options.server.getName(),
				onChange: function(field) {
					this.options.server.setName(field.getValue());
				}.bind(this)
			});

			this._urlField = new bbq.gui.form.URLField({
				value: this.options.server.getUrl() ? this.options.server.getUrl() : "http://",
				onChange: function(field) {
					this.options.server.setUrl(field.getValue());
					this._testSettings();
				}.bind(this)
			});
			this._typeField = new bbq.gui.form.DropDown({
				value: this.options.server.getSystem() ? this.options.server.getSystem() : "trac",
				options: [
					{key: "Please select...", value: null},
					{key: "Trac", value: "bigboard.ticketsystems.Trac"}
				],
				onChange: function(field) {
					this.options.server.setSystem(field.getValue());
				}.bind(this)
			});
			this._testButton = new bbq.gui.button.NativeButton({
				text: Language.get("serversettings.test"),
				onClick: this._testSettings.bind(this)
			});
			this._userNameField = new bbq.gui.form.TextField({
				value: this.options.server.getUser(),
				onChange: function() {
					this.options.server.setUser(this._userNameField.getValue());

					if(this._userNameField.getValue() && this._passwordField.getValue()) {
						this.options.server.setToken(btoa(this._userNameField.getValue() + ":" + this._passwordField.getValue()));
					} else {
						this.options.server.setToken(null);
					}
				}.bind(this)
			});
			this._passwordField = new bbq.gui.form.PasswordField({
				onChange: function() {
					if(this._userNameField.getValue() && this._passwordField.getValue()) {
						this.options.server.setToken(btoa(this._userNameField.getValue() + ":" + this._passwordField.getValue()));
					} else {
						this.options.server.setToken(null);
					}
				}.bind(this)
			});

			this._loadingNotification = new bbq.gui.LoadingNotification();

			this._userDetails = DOMUtil.createElement("fieldset", [
				DOMUtil.createElement("label", [
					Language.get("serversettings.username"),
					this._userNameField
				]),
				DOMUtil.createElement("label", [
					Language.get("serversettings.password"),
					this._passwordField
				])
			]);

			this._message = DOMUtil.createElement("p", " ");
		} catch(e) {
			Log.error("Error constructing AccessPreferences", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this._loadingNotification.hide();

		this.appendChild(DOMUtil.createElement("label", [
			DOMUtil.createElement("p", Language.get("serversettings.choosefriendlyname")),
			this._nameField
		]));
		this.appendChild(DOMUtil.createElement("label", [
			DOMUtil.createElement("p", Language.get("serversettings.enterurl")),
			this._urlField
		]));

		this.appendChild(this._userDetails);

		this.appendChild(DOMUtil.createElement("label", [
			DOMUtil.createElement("p", Language.get("serversettings.chooseticketsystem")),
			this._typeField
		]));

		this.appendChild(this._testButton);
		this.appendChild(this._loadingNotification);
		
		this.appendChild(this._message);
	},

	_testSettings: function() {
		if (this._testingSettings) {
			return;
		}

		if(!this.options.server.getSystem()) {
			this._showError(Language.get("serversettings.nosystemselected"));

			return;
		}

		var system = BBQUtil.findClass(this.options.server.getSystem());

		var ticketSystem = new system({
			url: this._urlField.getValue(),
			token: this.options.server.getToken()
		});
		ticketSystem.testConnection(
				this._settingsOk.bind(this),
				this._errorConnecting.bind(this),
				this._needsAuthentication.bind(this)
		);

		this._testingSettings = true;
		this._loadingNotification.show();
	},

	_settingsOk: function() {
		this._testingSettings = false;
		this._loadingNotification.hide();
		this._showOk(Language.get("serversettings.detailsok"));
	},

	_settingsNotOk: function(serverResponse) {
		this._testingSettings = false;
		this._loadingNotification.hide();

		var code = serverResponse.transport.getResponseHeader("X-BBQ-Remote-ResponseCode");

		if (code == 401) {
			this._showError(Language.get("serversettings.incorrectcredentials"));
		} else {
			this._showError(Language.get("serversettings.couldnotconnect"));
		}
	},

	_errorConnecting: function() {
		this._testingSettings = false;
		this._loadingNotification.hide();

		this._showError(Language.get("serversettings.couldnotconnect"));
	},

	_needsAuthentication: function() {
		this._testingSettings = false;
		this._loadingNotification.hide();

		this._showError(Language.get("serversettings.incorrectcredentials"));
	},

	_showError: function(message) {
		this._showMessage(message, "error", "ok");
	},

	_showOk: function(message) {
		this._showMessage(message, "ok", "error");
	},

	_showMessage: function(message, classToAdd, classToRemove) {
		DOMUtil.emptyNode(this._message);
		this._message.appendChild(document.createTextNode(message));
		this._message.addClassName(classToAdd);
		this._message.removeClassName(classToRemove);
	}
});
