const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { channels: { tipChannel } } = require("../../auth.json");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("tip")
		.setDescription("Give virtual tips.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send(":x: Make sure to include what you tipped!");

			if (isNaN(args[0])) return message.channel.send(`:x: ${args[0]} is not a number!`);

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle(`New tip from ${message.author.tag} (${message.author.id})`)
					.setDescription(`$${args[0]}`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4b0.png");

			client.channels.get(tipChannel).send(embed);

			return message.reply("Thank you for tipping us!");
		});
