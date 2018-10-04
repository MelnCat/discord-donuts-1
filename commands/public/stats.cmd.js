const Discord = require("discord.js");

const { everyone } = require("../../permissions");

module.exports = {
	name: "stats",
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
				.setFooter("Discord Donuts", client.user.avatarURL)
				.setAuthor(client.user.username, client.user.avatarURL)
				.setTimestamp();

		message.channel.send(embed);
	},
};
