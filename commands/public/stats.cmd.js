const Discord = require("discord.js");

const DDCommand = require("../../structures/DDCommand.struct");
const DDEmbed = require("../../structures/DDEmbed.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("stats")
		.setDescription("Info about the bots servers and shards.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Stats")
					.setDescription("Statistics of Discord Donuts")
					.addField("Servers", client.guilds.size)
					.addField("Users", client.users.size)
					.addField("Channels", client.channels.size)
					.addField("Memory Usage", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))
					.addField("Discord.js Version", Discord.version)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");

			message.channel.send(embed);
		});
