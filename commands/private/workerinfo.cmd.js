const DDEmbed = require("../../structures/DDEmbed.struct");

const { canCook } = require("../../permissions");
const { WorkerInfo } = require("../../sequelize");

module.exports = {
	name: "workerinfo",
	permissions: canCook,
	description: "View a worker's stats.",
	async execute(message, args, client) {
		if (!args.shift()) {
			let worker = await WorkerInfo.findOne({ where: { id: message.author.id } });

			const embed = new DDEmbed(client)
				.setStyle("white")
				.setTitle(`Worker Info for ${message.author.username}+${message.author.discriminator}`)
				.addField("Orders Cooked", worker.cooks)
				.addField("Orders Delivered", worker.delivers)
				.addField("Last Cook", timeAgoToString(worker.lastCook))
				.addField("Last Deliver", timeAgoToString(worker.lastDeliver));

			message.channel.send(embed);
		} else {
			let workerID = args[0].replace("<", "");
			workerID = workerID.replace("!", "");
			workerID = workerID.replace("@", "");
			workerID = workerID.replace(">", "");

			let worker = await WorkerInfo.findOne({ where: { id: workerID } });

			const embed = new DDEmbed(client)
				.setStyle("white")
				.setTitle(`Worker Info for ${client.users.get(worker).username}+${client.users.get(worker).discriminator}`)
				.addField("Orders Cooked", worker.cooks)
				.addField("Orders Delivered", worker.delivers)
				.addField("Last Cook", timeAgoToString(worker.lastCook))
				.addField("Last Deliver", timeAgoToString(worker.lastDeliver));

			message.channel.send(embed);
		}
	},
};

function timeAgoToString(timestamp) {
	let timeAgo = Date.now() - timestamp;
	let minutes = parseInt(timeAgo / (1000 * 60));
	let hours = parseInt(timeAgo / (1000 * 60 * 60));
	let days = parseInt(timeAgo / (1000 * 60 * 60 * 24));

	return `${days} Days, ${hours} Hours, and ${minutes} Minutes Ago.`;
}
