include(bbq.gui.GUIWidget);
include(bbq.util.Log);

bigboard.gui.tickets.FreeTicketSpot = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("FreeTicketSpot");
		} catch(e) {
			Log.error("Error constructing FreeTicketSpot", e);
		}
	}
});
