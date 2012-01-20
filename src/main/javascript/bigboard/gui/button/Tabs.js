include(bbq.gui.button.ButtonHolder);
include(bbq.util.Log);

bigboard.gui.button.Tabs = new Class.create(bbq.gui.button.ButtonHolder, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("Tabs");
		} catch(e) {
			Log.error("Error constructing Tabs", e);
		}
	}
});
