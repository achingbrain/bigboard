
bigboard.domain.Ticket = new Class.create({
	_id: null,
	_status: null,
	_lastUpdated: null,
	_description: null,
	_reporter: null,
	_resolution: null,
	_cc: null,
	_component: null,
	_summary: null,
	_priority: null,
	_keywords: null,
	_milestone: null,
	_owner: null,
	_type: null,
	_severity: null,
	_reported: null,

	_loadedData: false,
	_descriptionHolder: null,

	getId: function() {
		return this._id;
	},

	setId: function(id) {
		this._id = id;
	},

	getStatus: function() {
		return this._status;
	},

	setStatus: function(status) {
		this._status = status;
	},

	getLastUpdated: function() {
		return this._lastUpdated;
	},

	setLastUpdated: function(lastUpdated) {
		this._lastUpdated = lastUpdated;
	},

	getDescriptionDisplay: function() {
		if(!this._loadedData) {
			this._descriptionHolder = DOMUtil.createElement("div", {
				className: "description"
			});
			var loader = new bbq.gui.LoadingNotification();
			loader.appendTo(this._descriptionHolder);

			currentPage.server.loadData(this, function(text) {
				this._loadedData = true;

				DOMUtil.emptyNode(this._descriptionHolder);

				this._description = text;
				this._descriptionHolder.innerHTML = this._description;
			}.bind(this))

			return this._descriptionHolder;
		}

		var output = DOMUtil.createElement("div", {
			className: "description"
		});
		output.innerHTML = this._description;

		return output;
	},

	getDescription: function() {
		return this._description;
	},

	setDescription: function(description) {
		this._description = description;
	},

	getReporter: function() {
		return this._reporter;
	},

	setReporter: function(reporter) {
		this._reporter = reporter;
	},

	getResolution: function() {
		return this._resolution;
	},

	setResolution: function(resolution) {
		this._resolution = resolution;
	},

	getCC: function() {
		return this._cc;
	},

	setCC: function(cc) {
		this._cc = cc;
	},

	getComponent: function() {
		return this._component;
	},

	setComponent: function(component) {
		this._component = component;
	},

	getSummary: function() {
		return this._summary;
	},

	setSummary: function(summary) {
		this._summary = summary;
	},

	getPriority: function() {
		return this._priority;
	},

	setPriority: function(priority) {
		this._priority = priority;
	},

	getKeywords: function() {
		return this._keywords;
	},

	setKeywords: function(keywords) {
		this._keywords = keywords;
	},

	getMilestone: function() {
		return this._milestone;
	},

	setMilestone: function(milestone) {
		this._milestone = milestone;
	},

	getOwner: function() {
		return this._owner;
	},

	setOwner: function(owner) {
		this._owner = owner;
	},

	getType: function() {
		return this._type;
	},

	setType: function(type) {
		this._type = type;
	},

	getSeverity: function() {
		return this._severity;
	},

	setSevertiy: function(severity) {
		this._severity = severity;
	},

	getReported: function() {
		return this._reported;
	},

	setReported: function(reported) {
		this._reported = reported;
	}
});
