const { timeout } = require("../../helpers");
const { isBotOwner } = require("../../permissions");
const { pullScript } = require("../../auth.json");

const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { execFileSync } = require("child_process");

module.exports =
	new DDCommand()
		.setName("pull")
		.setDescription("Pulls changes to the bot")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			await message.reply("Are you sure you would like to pull changes? Type yes to continue.");
			const responses = await message.channel.awaitMessages(m => m.content === "yes", { max: 1, time: 10000 });

			if (responses.size > 0) return message.channel.send(execFileSync(pullScript), { code: "bash" });

			message.reply("Pull cancelled.");
		});
