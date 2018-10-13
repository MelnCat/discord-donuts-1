const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("ping")
		.setDescription("The bot ping.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const startTime = Date.now();

			const loadingEmbed = client.getEmbed("pingLoading")
				.setStyle("colorful");
			const pingMessage = await message.channel.send(loadingEmbed);

			const finishedEmbed =
				client.getEmbed("pingFinished", Math.round(Date.now() - startTime))
					.setStyle("colorful");
			pingMessage.edit(finishedEmbed);
		});
