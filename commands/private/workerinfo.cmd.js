const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { canCook } = require("../../permissions");
const { WorkerInfo } = require("../../sequelize");

module.exports =
	new DDCommand()
		.setName("workerinfo")
		.setDescription("View a worker's stats.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!message.mentions.users.first()) {
				const [ worker ] = await WorkerInfo.findOrCreate({ // eslint-disable-line array-bracket-spacing
					where: { id: message.author.id },
					defaults: {
						id: message.author.id,
						cooks: 0,
						delivers: 0,
						lastCook: 0,
						lastDeliver: 0
					}
				});

				const embed = new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Worker Info for ${message.author.username}#${message.author.discriminator}`)
					.addField("Orders Cooked", worker.get("cooks"))
					.addField("Orders Delivered", worker.get("delivers"))
					.addField("Last Cook", timeAgoToString(worker.get("lastCook")))
					.addField("Last Deliver", timeAgoToString(worker.get("lastDeliver")))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");

				message.channel.send(embed);
			} else {
				let workerID = message.mentions.users.first().id;

				let worker = await WorkerInfo.findOne({ where: { id: workerID } });

				const embed = new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Worker Info for ${client.users.get(worker.get("id")).username}#${client.users.get(worker.get("id")).discriminator}`)
					.addField("Orders Cooked", worker.cooks)
					.addField("Orders Delivered", worker.delivers)
					.addField("Last Cook", timeAgoToString(worker.get("lastCook")))
					.addField("Last Deliver", timeAgoToString(worker.get("lastDeliver")))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");

				message.channel.send(embed);
			}
		});


function timeAgoToString(timestamp) {
	let d = Date.now() - timestamp;
	if (timestamp == 0) return "Never";
	let da = d;
	let times = [];

        times.push(parseInt(Math.floor(da / 31536000000)));
		da %= 31536000000;


        times.push(parseInt(Math.floor(da / 2628000000)));
		da %= 2628000000;


        times.push(parseInt(Math.floor(da / 604800000)));
		da %= 604800000;


        times.push(parseInt(Math.floor(da / 86400000)));
		da %= 86400000;


        times.push(parseInt(Math.floor(da / 3600000)));
		da %= 3600000;


        times.push(parseInt(Math.floor(da / 60000)));
		da %= 60000;


        times.push(parseInt(Math.floor(da / 1000)));
		da %= 1000;

		times.push(da);
let years = times[0];
let months = times[1];
let weeks = times[2];
let days = times[3];
let hours = times[4];
let minutes = times[5];
let seconds = times[6];
let milliseconds = times[7];
let timenames = { 0: "years", 1: "months", 2: "weeks", 3: "days", 4: "hours", 5: "minutes", 6: "seconds", 7: "milliseconds" };
let result = [];
for (let i = 0; i < times.length; i++) {
	if (!times[i] == 0) {
		result.push(`${times[i]} ${timenames[i]}`);
	}
}
return `${result.join(", ").replaceLast(", ", " and ")} ago.`;
}
