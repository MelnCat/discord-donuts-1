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
					.setTitle(`Worker Info for ${client.users.get(worker.get("id")).username}+${client.users.get(worker.get("id")).discriminator}`)
					.addField("Orders Cooked", worker.cooks)
					.addField("Orders Delivered", worker.delivers)
					.addField("Last Cook", timeAgoToString(worker.get('lastCook')))
					.addField("Last Deliver", timeAgoToString(worker.get('lastDeliver')))
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");

				message.channel.send(embed);
			}
		});
/**
 * 
 * @param { number } timestamp 
 */
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
