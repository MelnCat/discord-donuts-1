const DAEmbed = require("../../structures/DAEmbed.struct");
const DACommand = require("../../structures/DACommand.struct");

const { feedbackChannel } = require("../../auth.json");

const { everyone } = require("../../permissions");

module.exports =
	new DACommand()
		.setName("feedback")
		.setDescription("Feedback on the bot.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const embed =
				new DAEmbed(client)
					.setStyle("white")
					.setTitle(`New feedback from ${message.author.tag} (${message.author.id})`)
					.setDescription(args.join(" "))
					.setThumbnail("https://images.emojiterra.com/google/android-pie/128px/1f4ad.png");


			if (!args[0]) return message.channel.send(`:x: Make sure to include what you'd like to say!`);

			client.channels.get(feedbackChannel).send(embed);
			message.reply("Thank you for giving us your feedback! We seriously appreciate it.");
		});
