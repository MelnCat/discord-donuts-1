const Discord = require("discord.js");

const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("servers")
		.setDescription("Info about the bots servers and shards")
		.setDescription(everyone)
		.setFunction(async(message, args, client) => {
			// FIXME: Need better wording
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Number of servers")
					.setDescription("Information on the number of servers / shards of this bot.")
					.addField("Total servers", await client.shard.broadcastEval("this.guilds.size")
						.then(arr => arr.reduce((acc, x) => acc + x))
						.catch(console.log))
					.addField("Current shard", `Shard ${client.shard.id}`)
					.addField("Servers on current shard", client.guilds.size);
			message.channel.send(embed);
		});
