const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { channels: { absenceChannel }, awayRole } = require("../../auth");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("away")
		.addAliases("request-absence", "absence")
		.setDescription("Request absence with this command.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (args[0] && args[0].toLowerCase() === "end") {
				if (!message.member.roles.some(role => role.id === awayRole)) return message.channel.send("You are not away!");
				const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Ended Absence")
					.setDescription(`${message.author.tag} is no longer away.`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
				client.channels.get(absenceChannel).send(embed);
				message.member.roles.remove(awayRole);
				return message.channel.send("Removed your absence!");
			}
			message.channel.send("What is your absence reason?");
			const reasons = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000 });
			if (reasons.size === 0) return message.channel.send("You did not provide me with a reason so I cancelled this session.");
			const reason = reasons.first().content;
			message.channel.send("When will your absence start? Format it as `MM-DD-YYYY` or reply with `now` for today.");
			const timestarts = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 15000 });
			if (timestarts.size === 0) return message.channel.send("You did not provide me with a starting time so I cancelled this session.");
			const timestart = timestarts.first().content;
			let tstart;
			if (timestart.toLowerCase() === "now") {
				tstart = new Date().toDateString();
			} else if (timestart.match(/^\d{2}-\d{2}-\d{4}$/) !== null) {
				tstart = new Date(timestart).toDateString();
			} else {
				return message.channel.send("Your format is incorrect.");
			}

			if (tstart === "Invalid Date") return message.channel.send("Your format or date may be incorrect.");
			message.channel.send(`Your starting date has been set to ${tstart}!`);
			message.channel.send("When will your absence end? Format it as `MM-DD-YYYY` or reply with `unknown` for an unknown time.");
			const timeends = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 15000 });
			if (timeends.size === 0) return message.channel.send("You did not provide me with a starting time so I cancelled this session.");
			const timeend = timeends.first().content;
			let tend;
			if (timeend.toLowerCase() === "unknown") {
				tend = "Unknown";
			} else if (timeend.match(/^\d{2}-\d{2}-\d{4}$/) !== null) {
				tend = new Date(timeend).toDateString();
			} else {
				return message.channel.send("Your format is incorrect.");
			}
			if (tend === "Invalid Date") return message.channel.send("Your format or date may be incorrect.");
			message.channel.send(`Your ending date has been set to ${tend}!`);
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("New Absence")
					.setDescription(`${message.author.tag} is now away.`)
					.addField("Time", `${tstart} to ${tend}`)
					.addField("Reason", `${reason}`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
			client.channels.get(absenceChannel).send(embed);
			message.member.roles.add(awayRole);
			message.channel.send("Added absence!");
		});
