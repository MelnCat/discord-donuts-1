const Discord = require("discord.js");

const { everyone } = require("../../permissions");

module.exports = {
	name: "servers",
	description: "Info about the bots servers and shards",
	permissions: everyone,
	/**
   *
   * @param { Discord.Message } message The message with the command
   * @param { [String] } args The arguments to the command
   * @param { Discord.Client } client The client instance
   */
	async execute(message, args, client) {
		// FIXME: Need better wording
		const embed =
      new Discord.MessageEmbed()
      	.setTitle("Number of servers")
      	.setDescription("Information on the number of servers / shards of this bot.")
      	.addField("Total servers", await client.shard.broadcastEval("this.guilds.size")
      		.then(arr => arr.reduce((acc, x) => acc + x))
      		.catch(console.log))
      	.addField("Current shard", `Shard ${client.shard.id}`)
      	.addField("Servers on current shard", client.guilds.size)
      	.addTimestamp();

		message.channel.send(embed);
	},
};
