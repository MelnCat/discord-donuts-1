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
			chunk(25)(uniqueCommands).forEach(async(section, index, arr) => {
				const embed = new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Discord Donuts Commands (Page ${index + 1} of ${arr.length})`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2754.png");
				section.forEach(command => {
					if (!(command instanceof DDCommand)) return;
					if (!command.getPermissions(message.member)) return;
					embed.addField(`${command.getName()}${command.getAliases().map(x => `, ${x}`).join("")}`, command.getDescription());
				});
				await message.author.send(embed);
			});

			await message.channel.send("Check your DM's for my command list");
		});
