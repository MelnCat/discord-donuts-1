const DDCommand = require("../../structures/DDCommand.struct");
const DDEmbed = require("../../structures/DDEmbed.struct");
const { everyone } = require("../../permissions.js");

module.exports =
	new DDCommand()
		.setName("help")
		.setDescription("Shows help about the bot")
		.setPermissions(everyone)
		.setFunction((message, args, client) => {
			let embed = new DDEmbed(client)
				.setStyle("colorful");
			client.commands.forEach(command => {
				if (!(command instanceof DDCommand)) return;
				console.log(command);
				if (!command.getPermissions(message.member)) return;
				try {
					embed.addField(command.getName(), command.getDescription());
				} catch (err) {
					if (!(err instanceof RangeError)) throw err;

					message.author.send(embed);

					embed = new DDEmbed(client)
						.setStyle("colorful");
					embed.addField(command.getName(), command.getDescription());
				}
			});
			return message.author.send(embed);
		});
