const Discord = require("discord.js");

const glob = require("glob");

class DDClient extends Discord.Client {
	constructor(options) {
		super(options);

		this.commands = new Discord.Collection();
		this.embeds = new Discord.Collection();

		this.loadCommands();
		this.loadEmbeds();
	}

	loadCommands() {
		this.commands = new Discord.Collection();
		const commandFiles = glob.sync("./commands/**/*.cmd.js");

		console.log(commandFiles);

		commandFiles.forEach(file => {
			const command = require(`.${file}`);
			this.commands.set(command.name, command);
		});
	}

	loadEmbeds() {
		this.embeds = new Discord.Collection();
		const embedFiles = glob.sync("./embeds/*.embed.js");

		console.log(embedFiles);

		embedFiles.forEach(file => {
			const embedGen = require(`.${file}`);
			this.embeds.set(file.split("/").pop().replace(".embed.js", ""), embedGen);
		});
		console.log(this.embeds.keys());
	}

	getCommand(command) {
		return this.commands.get(command);
	}

	getEmbed(name, ...args) {
		return this.embeds.get(name)(this, args);
	}
}

module.exports = DDClient;
