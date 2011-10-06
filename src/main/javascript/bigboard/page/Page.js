include(bbq.BBQ);
include(bbq.page.Page);
include(bbq.util.Log);
include(bbq.language.Language);
include(bbq.gui.button.NativeButton);
include(bbq.ajax.JSONRequest);

bigboard.page.Page = new Class.create(bbq.page.Page, {
	_wonderBar: null,

	initialize: function($super, args) {
		try {
			$super(args);

			Language.load({section: this._getLanguageSection(), postLoad: this._languageLoaded.bind(this)});
		} catch(e) {
			Log.error("Error constructing Page", e);
		}
	},

	_getLanguageSection: function() {

	},

	_languageLoaded: function() {
		try {
			this._init();
		} catch(e) {
			Log.error("Error initing" + this._getLanguageSection(), e);
		}
	},

	_init: function() {
		alert("huh");
	}
});
