const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");
const { ratings } = require("../../sequelize");

module.exports =
	new DDCommand()
		.setName("rate")
		.setDescription("Rate your cook or deliverer.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
            if (!args[0]) return message.channel.send("Please tell me if you want to rate cook or deliverer! Example: `d!rate cook 4`");
            if (args[0].includes("cook")) {
                let res = await WorkerInfo.findOne({ where: { lastCookID: message.author.id } });
                let resall = await WorkerInfo.findAll({ where: { lastCookID: message.author.id } });
            } else if (args[0].includes("deliver")) {
                let resall = await WorkerInfo.findAll({ where: { lastDeliverID: message.author.id } });
                let res = await WorkerInfo.findOne({ where: { lastCookID: message.author.id } });
            } else {
                return message.channel.send("Please input cook or deliver!");
            }
            if (!args[1] || isNaN(args[1]) || args[1] > 5 || args[1] < 1) return message.channel.send("Please give me a number between 1 and 5!");
				const [ wratings ] = await ratings.findOrCreate({ // eslint-disable-line array-bracket-spacing
					where: { id: res.get("id") },
					defaults: {
						id: res.get("id"),
                        rate1: 0,
                        rate2: 0,
                        rate3: 0,
                        rate4: 0,
                        rate5: 0,

					}
				});
                wratings.update({ [`rate${args[1]}`]: wratings[`rate${args[1]}`] + 1 });
				const embed = new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Worker Info for ${message.author.username}#${message.author.discriminator}`)
					.addField("Orders Cooked", worker.get("cooks"))
					.addField("Orders Delivered", worker.get("delivers"))
					.addField("Last Cook", timeAgoToString(worker.get("lastCook")))
					.addField("Last Deliver", timeAgoToString(worker.get("lastDeliver")))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");

				message.channel.send(embed);
		});


function timeAgoToString(timestamp) {
	if (timestamp === 0) return "Never";
	let timeAgo = Date.now() - timestamp;
	console.log(Date.now(), timestamp, timeAgo);
	let days = parseInt(timeAgo / (1000 * 60 * 60 * 24));

	timeAgo -= days;
	let hours = parseInt(timeAgo / (1000 * 60 * 60));
	timeAgo -= hours;
	let minutes = parseInt(timeAgo / (1000 * 60));


	return `${days} Days, ${hours} Hours, and ${minutes} Minutes Ago.`;
}
