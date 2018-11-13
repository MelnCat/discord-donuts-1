const Discord = require("discord.js");

const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");
const { calcUptime } = require("../../helpers");

module.exports =
	new DDCommand()
		.setName("stats")
		.setDescription("Info about the bots servers and shards.")
		.setPermissions(everyone)
		.setFunction((message, args, client) => {

			const embed = new Discord.MessageEmbed()
				.setColor(0x36393E)
				.addField(`Users`, client.users.size, true)
				.addField(`Servers`, client.guilds.size, true)
				.addField(`Heap Usage`, (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), true)
				.setFooter(`Uptime: ${calcUptime(client.uptime)}`, client.user.displayAvatarURL())

			return message.channel.send(embed);
		});
