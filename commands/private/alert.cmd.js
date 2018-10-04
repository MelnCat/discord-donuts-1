const { isBotOwner } = require("../../permissions");
module.exports = {
	name: "alert",
	permissions: isBotOwner,
	description: "Use this to send an alert to kitchen.",
	async execute(message, args, client) {
		let text = args;
		text.shift();
		text = text.join(" ");
		if (!args[1]) {
			message.channel.send("You did not provide anything for me to send!");
			return;
		}
		message.guild.channels.get("295652105400614922").send({
			embed: {
				timestamp: new Date(),
				color: Math.floor(Math.random() * 16777216),
				description: text,
			},
		});
	},
};
