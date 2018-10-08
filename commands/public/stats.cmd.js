const Discord = require("discord.js");

const DDCommand = require("../../structures/DDCommand.struct");
const DDEmbed = require("../../structures/DDEmbed.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("stats")
		.setDescription("Info about the bots servers and shards.")
		.setDescription(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Stats")
					.setDescription("Statistics of Discord Donuts")
					.addField("Servers", await client.shard.broadcastEval("this.guilds.size")
						.then(arr => arr.reduce((acc, x) => acc + x))
						.catch(console.log))
					.addField("Users", await client.shard.broadcastEval("this.users.size")
						.then(arr => arr.reduce((acc, x) => acc + x))
						.catch(console.log))
					.addField("Channels", await client.shard.broadcastEval("this.channels.size")
						.then(arr => arr.reduce((acc, x) => acc + x))
						.catch(console.log))
					.addField("Memory Usage", await client.shard.broadcastEval("process.memoryUsage().heapUsed / 1024 / 1024")
						.then(arr => arr.reduce((acc, x) => acc + x))
						.then(x => `${x.toFixed(2)} MB`)
						.catch(console.log))
					.addField("Discord.js Version", Discord.version)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");

			message.channel.send(embed);
		});
