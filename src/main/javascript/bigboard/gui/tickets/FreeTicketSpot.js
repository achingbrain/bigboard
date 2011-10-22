include(bbq.gui.GUIWidget);
include(bbq.util.Log);
include(bigboard.gui.tickets.TicketSummary);
include(bbq.gui.DragAndDrop);

bigboard.gui.tickets.FreeTicketSpot = new Class.create(bbq.gui.GUIWidget, {

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("FreeTicketSpot");

			DragAndDropManager.makeDropTarget(this);
		} catch(e) {
			Log.error("Error constructing FreeTicketSpot", e);
		}
	},

	dropTargetWillAccept: function(draggable) {
		return draggable instanceof bigboard.gui.tickets.TicketSummary;
	},

	dropTargetEnter: function(draggable) {
		this.addClass("FreeTicketSpot_over");
	},

	dropTargetLeave: function(draggable) {
		this.removeClass("FreeTicketSpot_over");
	},

	dropTargetDropped: function(draggable) {
		this.removeClass("FreeTicketSpot_over");
	}
});
