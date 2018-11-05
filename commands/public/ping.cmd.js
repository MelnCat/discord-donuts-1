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

			const loadingEmbed =
				new DDEmbed(client)
					.setStyle("colorful")
					.addField("Ping", `Pinging...`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");

			const pingMessage = await message.channel.send(loadingEmbed);

			const finishedEmbed =
				new DDEmbed(client)
					.setStyle("colorful")
					.addField("Ping", `:ping_pong: Pong! Took \`${Math.round(Date.now() - startTime)} ms\`!`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");

			pingMessage.edit(finishedEmbed);
		});
