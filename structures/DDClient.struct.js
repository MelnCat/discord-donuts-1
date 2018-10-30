const path = require("path");

const Discord = require("discord.js");

const glob = require("glob");

class DDClient extends Discord.Client {
	constructor(options) {
		super(options);

		this.commands = new Discord.Collection();

		this.loadCommands();
	}

	loadCommands() {
		this.commands = new Discord.Collection();
		const commandFiles = glob.sync("./commands/**/*.cmd.js");

		console.log(commandFiles);

		commandFiles.forEach(file => {
			const command = require(`.${file}`);

			console.log(command);

			command.setCategory(path.basename(path.dirname(`.${file}`)));

			this.commands.set(command.name, command);

			command.aliases.forEach(alias => {
				this.commands.set(alias, command);
			});
		});
	}

	getCommand(command) {
		return this.commands.get(command);
	}
}

module.exports = DDClient;
