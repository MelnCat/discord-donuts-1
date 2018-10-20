const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { absenceChannel } = require("../../auth.json");

const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("away")
		.setDescription("Request absence.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (args[0] == "end") {
				message.channel.send("Absence Ended!");
				const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle(`Absence ended from ${message.author.tag} (${message.author.id})`)
					.setDescription(args.join(" ").replace("*,", ","))
					.setThumbnail("https://images.emojiterra.com/google/android-pie/128px/1f4ad.png");

				client.channels.get(absenceChannel).send(embed);
			}
			const cleaned = message.content.replace("*,", "");
			if (!args[0]) return message.channel.send(":x: Make sure to include your reason and time! Example: `d!away Oct 20 to Oct 30, Vacation.`");
			if (cleaned.split(",").length < 2) return message.channel.send("Make sure to include your reason! Example: `d!away Oct 20 to Oct 30, Vacation.`");
			if (cleaned.split(",").length > 2) return message.channel.send("Please use only one command for the seperation of the date and reason! Try `*,` for commas instead.");
			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle(`New absence from ${message.author.tag} (${message.author.id})`)
					.setDescription(args.join(" ").replace("*,", ","))
					.setThumbnail("https://images.emojiterra.com/google/android-pie/128px/1f4ad.png");

			client.channels.get(absenceChannel).send(embed);

			return message.reply("Absence sent! Do `d!away end` to end your absence.");
		});
