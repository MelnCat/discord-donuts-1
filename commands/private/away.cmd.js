const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { channels: {absenceChannel} } = require("../../auth.json");

const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("away")
		.setDescription("Request absence.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (args[0] == "end") {
				if (!client.guilds.get("294619824842080257").members.get(message.author.id).roles.keyArray().includes("501129992994816000")) {
					return message.channel.send("You are not away!")
				}
				client.guilds.get("294619824842080257").members.get(message.author.id).roles.remove("501129992994816000")
				message.channel.send("Absence Ended!");
				const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle(`Absence ended from ${message.author.tag} (${message.author.id})`)
					.setDescription(args.join(" ").replace("*,", ","))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2708.png");

				client.channels.get(absenceChannel).send(embed);
			}
			if (client.guilds.get("294619824842080257").members.get(message.author.id).roles.keyArray().includes("501129992994816000")) {
				return message.channel.send("You are already away!")
			}
			const cleaned = args.join(" ").replace("*,", "");
			if (!args[0]) return message.channel.send(":x: Make sure to include your reason and time! Example: `d!away Oct 20 to Oct 30, Vacation.`");
			if (cleaned.split(",").length < 2) return message.channel.send("Make sure to include your reason! Example: `d!away Oct 20 to Oct 30, Vacation.`");
			if (cleaned.split(",").length > 2) return message.channel.send("Please use only one comma for the separation of the date and reason! Try `*,` for commas instead.");
			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle(`New absence from ${message.author.tag} (${message.author.id})`)
					.addField("Time", cleaned.split(",")[0].trim())
					.addField("Reason", cleaned.split(",")[1].trim())
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2708.png");

			client.channels.get(absenceChannel).send(embed);
			client.guilds.get("294619824842080257").members.get(message.author.id).roles.add("294619824842080257")
			return message.reply("Absence sent! Do `d!away end` to end your absence.");
		});
