const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");
const { calcUptime } = require ("../../helpers")
module.exports =
	new DDCommand()
		.setName("uptime")
		.setDescription("The bot uptime.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Uptime")
					.setDescription(calcUptime(client.uptime))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");

			await message.channel.send(embed);
		});
