include(bigboard.page.PageNotFound);

test = new Test.Unit.Runner({
	page: null,

	setup: function() {
		with (this) {
			this.page = new bigboard.page.PageNotFound();
		}
	},

	teardown: function() {
		with (this) {

		}
	},

	testSomething: function() {
		with (this) {
			// should probably test something now
		}
	}
});
