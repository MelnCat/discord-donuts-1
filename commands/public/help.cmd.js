const DDCommand = require("../../structures/DDCommand.struct");
const DDEmbed = require("../../structures/DDEmbed.struct");
const { everyone } = require("../../permissions.js");
const { chunk } = require("../../helpers");

module.exports =
	new DDCommand()
		.setName("help")
		.setDescription("Shows help about the bot")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const uniqueCommands = client.commands.array()
				.filter((val, index, arr) => arr.indexOf(val) === index);

			chunk(25)(uniqueCommands).forEach(section => {
				const embed = new DDEmbed(client);
				section.forEach(command => {
					if (!(command instanceof DDCommand)) return;
					if (!command.getPermissions(message.member)) return;

					embed.addField(`${command.getName()}${command.getAliases().map(x => `, ${x}`)}`, command.getDescription());
				});
				await message.author.send(embed);
			});

			await message.author.send("Check your DM's for my command list")
		});
