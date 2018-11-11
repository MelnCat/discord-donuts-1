const { MessageEmbed } = require("discord.js");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");
const { calcUptime } = require("../../helpers");

module.exports =
	new DDCommand()
		.setName("uptime")
		.setDescription("The bot uptime.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed = new MessageEmbed().setColor(0x36393E).setDescription(calcUptime(client.uptime))
.setFooter(client.user.tag, client.user.displayAvatarURL())
.setTimestamp();
			await message.channel.send(embed);
		});
