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
			message.channel.awaitMessages(m => m.content === "yes", { max: 1, time: 10000, errors: ["time"] })
				.then(async() => {
					message.channel.send(`Restart triggered by ${message.author.username}.`);
					const embed =
						new DDEmbed(client)
							.setStyle("colorful")
							.setTitle("Restart")
							.setDescription(`Restart triggered by ${message.author.username}.`)
							.setThumbnail("http://cdn.onlinewebfonts.com/svg/img_430150.png");

					message.channel.send(embed);

					await timeout(1500);
					process.exit();
				})
				.catch(() => {
					const embed =
						new DDEmbed(client)
							.setStyle("colorful")
							.setTitle("Restart")
							.setDescription("No response found, command cancelled.")
							.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

					message.channel.send(embed);
				});
		});
