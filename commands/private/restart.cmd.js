const { timeout } = require("../../helpers");

const { isBotOwner } = require("../../permissions");

module.exports = {
	name: "restart",
	description: "Restart the bot.",
	permissions: isBotOwner,
	async execute(message, args, client) {
		await message.reply("Are you sure you would like to restart the bot? Type yes to continue.");
		message.channel.awaitMessages(m => m.content === "yes", { max: 1, time: 10000, errors: ["time"] })
			.then(async() => {
				message.channel.send(`Restart triggered by ${message.author.username}.`);
				await timeout(1500);
				process.exit();
			})
			.catch(() => message.channel.send("No response found, command cancelled."));
	},
};
