include(bigboard.page.Page);
include(bbq.util.Log);

bigboard.page.Error = new Class.create(bigboard.page.Page, {

	initialize: function($super, args) {
		try {
			$super(args);
		} catch(e) {
			Log.error("Error constructing Error", e);
		}
	},

	_getLanguageSection: function() {
		return "Error";
	},

	_init: function() {

	}
});
