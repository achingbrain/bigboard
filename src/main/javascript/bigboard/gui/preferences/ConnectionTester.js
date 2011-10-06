include(bbq.ajax.ForwardingJSONRequest);

bigboard.gui.preferences.ConnectionTester = new Class.create({

	initialize: function($super, args) {
		
	},

	test: function(server, username, password) {
		new bbq.ajax.ForwardingJSONRequest({
			url: this._urlField.getValue(),
			onSuccess: this._settingsOk.bind(this),
			onError: this._settingsNotOk.bind(this),
			onException: this._settingsNotOk.bind(this),
			onFailure: this._settingsNotOk.bind(this)
		});
	},

	_settingsOk: function() {
		this.options.onDetailsOk();
	},

	_settingsNotOk: function(serverResponse) {
		var code = serverResponse.transport.getResponseHeader("X-BBQ-Remote-ResponseCode");

		if (code == 401) {
			this.options.onAuthenticationFaliure();
		} else {
			this.options.onConnectionFaliure();
		}
	}
});
