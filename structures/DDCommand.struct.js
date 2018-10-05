const DDCommand = class {
	setName(name) {
		this.name = name;
		return this;
	}

	setDescription(description) {
		this.description = description;
		return this;
	}

	setFunction(func) {
		this.func = func;
		return this;
	}

	getName() {
		return this.name || new TypeError("A name has not been specified for this command");
	}

	getDescription() {
		return this.description || new TypeError("A description has not been specified for this command");
	}

	runFunction() {
		return this.func() || new TypeError("A function has not been specified for this command");
	}
};

module.exports = DDCommand;
