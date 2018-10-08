const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("servers")
		.setDescription("Info about the bots servers and shards.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Number of servers")
					.setDescription("Information on the number of servers / shards of this bot.")
					.addField("Total servers", await client.shard.broadcastEval("this.guilds.size")
						.then(arr => arr.reduce((acc, x) => acc + x))
						.catch(console.log))
					.addField("Current shard", `Shard ${client.shard.id}`)
					.addField("Servers on current shard", client.guilds.size)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");
			message.channel.send(embed);
		});
