const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { channels: { feedbackChannel } } = require("../../auth.json");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("feedback")
		.setDescription("Feedback on the bot.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send(":x: Make sure to include what you'd like to say!");

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle(`New feedback from ${message.author.tag} (${message.author.id})`)
					.setDescription(args.join(" "))
					.setThumbnail("https://images.emojiterra.com/google/android-pie/128px/1f4ad.png");

			await client.channels.get(feedbackChannel).send(embed);

			return message.reply("Thank you for giving us your feedback! We seriously appreciate it.");
		});
