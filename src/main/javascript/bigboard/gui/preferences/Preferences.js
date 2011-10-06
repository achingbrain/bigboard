include(bbq.gui.GUIWidget);
include(bbq.util.Log);

bigboard.gui.preferences.Preferences = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("Preferences");
		} catch(e) {
			Log.error("Error constructing Preferences", e);
		}
	}
});
