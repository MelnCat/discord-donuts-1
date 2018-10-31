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
			if (!args[0]) return message.reply("Please provide an id");
			if (!args[0].match(/^[0-9]{18}$/)) return message.reply("That doesn't look like an id");

			const blacklist = await Blacklist.findById(args[0]);

			if (!blacklist) return message.reply("That user/guild hasn't been blacklisted");

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Unblacklist")
					.setDescription("Blacklist removed!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(embed);
		});
