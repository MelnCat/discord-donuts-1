module.exports = class DDClient extends require("discord.js").Client {
	constructor() {
		super();
		this.commands = new (require("discord.js")).Collection;
	}
};
