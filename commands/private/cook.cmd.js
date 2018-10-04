const { Orders } = require("../../sequelize");

const { timeout, autoDeliver } = require("../../helpers");

const { canCook } = require("../../permissions");

module.exports = {
	name: "cook",
	permissions: canCook,
	description: "Use this to cook donuts.",
	async execute(message, args, client) {
		const id = args.shift();
		const order = await Orders.findOne({ where: { id: id, claimer: message.author.id } });
		if (!order) return message.reply("Either this order doesn't exist, or you haven't claimed it.");
		// TODO: Support non URL image
		await message.channel.send("The next message you send will be set as the order's image Only URLs are supported atm :cry:.");
		const response = await message.channel.awaitMessages(m => m.author.id === order.get("claimer"), { max: 1, time: 30000 });
		if (!response.size) return message.reply("You didn't respond in time.");
		try {
			await Orders.update({ status: 2, url: response.first().content }, { where: { id: id }, individualHooks: true });
		} catch (e) {
			if (e.name === "SequelizeValidationError") {
				// TODO: Add better error detection
				return message.channel.send("That doesn't look like a URL to me.");
			}
		}
		message.channel.send("Your donut will take 3 minutes to cook.");

		await timeout(180000);

		message.reply("Your donut has finished cooking and will be delivered shortly.");

		await Orders.update({ status: 3 }, { where: { id: id }, individualHooks: true });

		await timeout(180000);

		autoDeliver(client, id);
	},
};
