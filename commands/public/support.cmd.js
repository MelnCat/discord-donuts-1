const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("support")
		.setDescription("The invite for the support server.")
		.setDescription(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Support Server Invite")
					.setDescription("The invite link for the support server.")
					.addField("Support Server Invite", "https://discord.gg/Kkyk3fM")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4e9.png");

			message.channel.send(embed);
		});
