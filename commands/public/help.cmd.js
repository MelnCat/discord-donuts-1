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
			let embed = new DDEmbed(client)
				.setStyle("colorful");
			let added = [];
			console.log(client.commands.array().filter((val, index, arr) => arr.indexOf(val) === index).map(x => x.name));
			/*
			const chunked = chunk(25)(client.commands.array());
			chunked.forEach(section => {
				const embed = new DDEmbed(client);
				section.forEach
			})
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

					message.author.send(embed);

					embed = new DDEmbed(client)
						.setStyle("colorful");
					embed.addField(command.getName(), command.getDescription());
				}
			});

			await message.author.send(embed);
			await message.reply("Check your DM's for my command list");
			*/
		});
