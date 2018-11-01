const { timeout } = require("../../helpers");
const { isBotOwner } = require("../../permissions");

const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

module.exports =
	new DDCommand()
		.setName("restart")
		.setDescription("Restart the bot.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			await message.reply("Are you sure you would like to restart the bot? Type yes to continue.");
			const responses = await message.channel.awaitMessages(m => m.content === "yes", { max: 1, time: 10000, errors: ["time"] });

			if (responses.size > 0) return process.exit();

			message.reply("Restart cancelled.");
		});
