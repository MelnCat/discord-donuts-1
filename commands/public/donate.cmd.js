const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("support")
		.setDescription("The invite for the support server.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Donate")
					.setDescription("Want to help us stay running and cook donuts? Support us by donating!")
					.addField("Patreon", "**<https://patreon.com/discorddonuts>**")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4e9.png");

			message.channel.send(embed);
		});
