include(bigboard.page.Page);
include(bbq.util.Log);

bigboard.page.PageNotFound = new Class.create(bigboard.page.Page, {

	initialize: function($super, args) {
		try {
			$super(args);
		} catch(e) {
			Log.error("Error constructing PageNotFound", e);
		}
	},

	_getLanguageSection: function() {
		return "PageNotFound";
	},

	_init: function() {

	}
});
