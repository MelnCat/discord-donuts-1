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
			if (!args[0].match(/^[0-9]{18}$/) return message.reply("That doesn't look like a valid id");
			if (!args[1]) return message.reply("Please provide a reason")
				await Blacklist.create({ id: args.shift(), reason: args.shift() });

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Blacklist")
					.setDescription("Blacklist added!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(embed);
		});
