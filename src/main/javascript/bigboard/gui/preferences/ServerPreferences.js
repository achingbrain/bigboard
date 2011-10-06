include(bigboard.gui.preferences.Preferences);
include(bbq.util.Log);
include(bbq.gui.form.TextField);
include(bbq.gui.form.PasswordField);
include(bbq.gui.form.DropDown);
include(bbq.gui.form.URLField);
include(bbq.ajax.ForwardingJSONRequest);
include(bbq.gui.LoadingNotification);
include(bbq.gui.form.CheckBox);
include(bigboard.ticketsystems.Trac);

bigboard.gui.preferences.ServerPreferences = new Class.create(bigboard.gui.preferences.Preferences, {
	_urlField: null,
	_typeField: null,
	_testButton: null,
	_userNameField: null,
	_passwordField: null,
	_needsAuthenticationField: null,
	_userDetails: false,
	_loadingNotification: null,
	_message: null,
	_testingSettings: false,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("ServerPreferences");

			this._urlField = new bbq.gui.form.URLField({
				value: Preferences.get(BIGBOARD_PREFERENCES.SERVER) ? Preferences.get(BIGBOARD_PREFERENCES.SERVER) : "http://",
				onChange: this._testSettings.bind(this)
			});
			this._typeField = new bbq.gui.form.DropDown({
				options: [
					{key: "Trac", value: "trac"}
				]
			});
			this._testButton = new bbq.gui.button.NativeButton({
				text: Language.get("serversettings.test"),
				onClick: this._testSettings.bind(this)
			});
			this._userNameField = new bbq.gui.form.TextField();
			this._passwordField = new bbq.gui.form.PasswordField();
			this._needsAuthenticationField = new bbq.gui.form.CheckBox({onChange: function() {
					if(this._needsAuthenticationField.getValue()) {
						this._userDetails.show();
					} else {
						this._userDetails.hide();
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
			this._userDetails.hide();

			this._message = DOMUtil.createElement("p", Language.get("serversettings.chooseticketsystem"));
		} catch(e) {
			Log.error("Error constructing ServerPreferences", e);
		}
	},

	render: function($super) {
		$super();

		this.empty();

		this._loadingNotification.hide();

		this.appendChild(DOMUtil.createElement("h2", Language.get("serversettings.header")));
		this.appendChild(this._message);
		this.appendChild(DOMUtil.createElement("label", [
			Language.get("serversettings.url"),
			this._urlField,
			DOMUtil.createElement("label", [
				Language.get("serversettings.needsauthentication"),
				this._needsAuthenticationField
			], {className: "needsAuthentication"}),
			this._typeField,
			this._testButton,
			this._loadingNotification
		]));

		this.appendChild(this._userDetails);
		this.appendChild(new bbq.gui.button.NativeButton({
			text: Language.get("serversettings.done"),
			onClick: this._testSettings.bind(this)
		}))
	},

	_testSettings: function() {
		if(this._testingSettings) {
			return;
		}

		this._testingSettings = true;

		this._loadingNotification.show();

		var ticketSystem = new bigboard.ticketsystems.Trac({
			url: this._urlField.getValue(),
			token: btoa(this._userNameField.getValue() + ":" + this._passwordField.getValue())
		});
		ticketSystem.testConnection(
				this._settingsOk.bind(this),
				this._errorConnecting.bind(this),
				this._needsAuthentication.bind(this)
		)
	},

	_settingsOk: function() {
		this._testingSettings = false;

		// store as preferences
		Preferences.set(BIGBOARD_PREFERENCES.SERVER, this._urlField.getValue());
		Preferences.set(BIGBOARD_PREFERENCES.TOKEN, btoa(this._userNameField.getValue() + ":" + this._passwordField.getValue()));
		Preferences.set(BIGBOARD_PREFERENCES.SYSTEM, "Trac");

		currentPage.clearModalLayer();

		// triggers page showing tickets
		this.notifyListeners("onUpdatedServerPreferences");
	},

	_settingsNotOk: function(serverResponse) {
		this._testingSettings = false;
		this._loadingNotification.hide();

		var code = serverResponse.transport.getResponseHeader("X-BBQ-Remote-ResponseCode");

		if(code == 401) {
			this._userDetails.show();
			this._needsAuthenticationField.setValue(true);
			this._showError(Language.get("serversettings.incorrectcredentials"));
		} else {
			this._userDetails.hide();
			this._showError(Language.get("serversettings.couldnotconnect"));
		}
	},
	
	_errorConnecting: function() {
		this._testingSettings = false;
		this._loadingNotification.hide();

		this._userDetails.hide();
		this._showError(Language.get("serversettings.couldnotconnect"));
	},

	_needsAuthentication: function() {
		this._testingSettings = false;
		this._loadingNotification.hide();

		this._userDetails.show();
		this._needsAuthenticationField.setValue(true);
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
