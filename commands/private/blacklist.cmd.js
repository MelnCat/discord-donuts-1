const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Blacklist } = require("../../sequelize");
const { isBotOwner } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("blacklist")
		.setDescription("Blacklist a user or a guild, with a reason.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			try {
				await Blacklist.create({ id: args.shift(), reason: args.shift() });
			} catch (e) {
				console.log(e);

				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Blacklist")
						.setDescription("Error: Did you run the command properly?")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Blacklist")
					.setDescription("Blacklist added!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(embed);
		});
