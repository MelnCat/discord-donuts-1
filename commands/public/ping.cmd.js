module.exports = {
	name: "ping",
	description: "ping...",
	async execute(message, args, client) {
		const startTime = Date.now();
		const pingMsg = await message.channel.send("Pinging...");
		pingMsg.edit(`:ping_pong: Pong! Took \`${Math.round(Date.now() - startTime)}ms\`!`);
	},
};
