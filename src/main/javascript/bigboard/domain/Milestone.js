
bigboard.domain.Milestone = new Class.create({
	_due: null,
	_completed: null,
	_description: null,
	_name: null,

	getName: function() {
		return this._name;
	},

	setName: function(name) {
		this._name = name;
	},

	getDescription: function() {
		return this._description;
	},

	setDescription: function(description) {
		this._description = description;
	},

	getDue: function() {
		return this._due;
	},

	setDue: function(due) {
		this._due = due;
	},

	getCompleted: function() {
		return this._completed;
	},

	setCompleted: function(completed) {
		this._completed = completed;
	}
});
