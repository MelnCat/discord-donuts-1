const { Blacklist } = require("../../sequelize");
const { isBotOwner } = require("../../permissions");

const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

module.exports =
	new DDCommand()
		.setName("unblacklist")
		.setDescription("Use this unblacklist a guild.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			try {
				await Blacklist.destroy({ where: { id: args.shift() } });
			} catch (e) {
				console.log(e);

				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Unblacklist")
						.setDescription("Error!")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				message.channel.send(embed);
			}

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Unblacklist")
					.setDescription("Blacklist removed!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(embed);
		});
