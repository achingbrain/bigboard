include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.tickets.TicketSummary);

bigboard.gui.tickets.FreeTicketSpot = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("FreeTicketSpot");

			DragAndDropManager.makeDroppable(this);
		} catch(e) {
			Log.error("Error constructing FreeTicketSpot", e);
		}
	},

	getDropTypes: function() {
		return [
			bigboard.gui.tickets.TicketSummary
		]
	},

	draggableDropped: function(draggable) {
		Log.info("Dropped draggable on free ticket spot");
		this.removeClass("FreeTicketSpot_over");
	},

	draggableEnter: function(draggable) {
		this.addClass("FreeTicketSpot_over");
	},

	draggableLeave: function(draggable) {
		this.removeClass("FreeTicketSpot_over");
	}
});
