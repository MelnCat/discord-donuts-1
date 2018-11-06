const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { channels: { absenceChannel } } = require("../../auth");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("away")
		.addAliases("request-absence", "absence")
		.setDescription("Request absence with this command.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			message.channel.send("What is your absence reason?");
			const reasons = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000 });
			if (reasons.size === 0) return message.channel.send("You did not provide me with a reason so I cancelled this session.");
			const reason = reasons.first().content;
			message.channel.send("When will your absence start? Format it as `MM-DD-YYYY` or reply with `now` for today.");
			const timestarts = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 15000 });
			if (timestarts.size === 0) return message.channel.send("You did not provide me with a starting time so I cancelled this session.");
			const timestart = timestarts.first().content;
			let tstart;
			const timestartsplit = timestart.split("-");
			if (timestart.toLowerCase() === "now") {
				tstart = new Date(Date.now());
			} else if ([timestartsplit[0].length, timestartsplit[1].length, timestartsplit[2].length] == [2, 2, 4]) {
				tstart = new Date(Date.now());
			} else {
				return message.channel.send("Your format is incorrect.");
			}
			if (tstart == "Invalid Date") return message.channel.send("Your format or date may be incorrect.");
			message.channel.send("When will your absence end? Format it as `MM-DD-YYYY` or reply with `unknown` for an unknown time.");
			const timeends = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 15000 });
			if (timeends.size === 0) return message.channel.send("You did not provide me with a starting time so I cancelled this session.");
			const timeend = timeends.first().content;
			let tend;
			const timeendsplit = timeend.split("-");
			if (timeend.toLowerCase() === "now") {
				tend = new Date(Date.now());
			} else if ([timeendsplit[0].length, timeendsplit[1].length, timeendsplit[2].length] === [2, 2, 4]) {
				tend = new Date(Date.now());
			} else {
				return message.channel.send("Your format is incorrect.");
			}
			if (tend === "Invalid Date") return message.channel.send("Your format or date may be incorrect.");
			message.channel.send(`${tstart} | ${tend}`);
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Ping")
					.setDescription("The bot ping.")
					.addField("Ping", `Pinging...`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
		});
