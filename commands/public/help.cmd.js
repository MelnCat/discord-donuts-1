const DDCommand = require("../../structures/DDCommand.struct");
const DDEmbed = require("../../structures/DDEmbed.struct");
const { everyone } = require("../../permissions.js");

module.exports =
	new DDCommand()
		.setName("help")
		.setDescription("Shows help about the bot")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			let embed = new DDEmbed(client)
				.setStyle("colorful");
			let added = [];
			client.commands.forEach(command => {
				if (!(command instanceof DDCommand)) return;
				if (!command.getPermissions(message.member)) return;
				try {
					if (!added.includes(command.getName())) {
						added.push(command.getName());
						embed.addField(command.getName(), command.getDescription());
				}
				} catch (err) {
					if (!(err instanceof RangeError)) throw err;
				}
			});
			chunk(25)(uniqueCommands).forEach(async(section, index, arr) => {
				const embed = new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Discord Donuts Commands (Page ${index + 1} of ${arr.length})`)
					.setThumbnail("https://images.emojiterra.com/twitter/72px/2754.png");
				section.forEach(command => {
					if (!(command instanceof DDCommand)) return;
					if (!command.getPermissions(message.member)) return;

					embed = new DDEmbed(client)
						.setStyle("colorful");
					embed.addField(command.getName(), command.getDescription());
				});
			});

			await message.author.send(embed);
			await message.reply("Check your DM's for my command list");
		});
