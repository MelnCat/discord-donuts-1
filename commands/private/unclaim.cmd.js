const { Orders } = require("../../sequelize");

const { canCook } = require("../../permissions");

module.exports = {
	name: "unclaim",
	permissions: canCook,
	description: "Use this to unclaim donut orders.",
	async execute(message, args, client) {
		if (!canCook(message.member)) return;

		const order = await Orders.findOne({ where: { id: args.shift(), claimer: message.author.id } });

		if (!order) return message.reply("Couldn't find that order or you don't have it claimed.");

		await order.update({ status: 0, claimer: null });

		await client.users.get(order.get("user")).send(`Sadly, your order has been unclaimed by **${message.author.username}**.`);

		message.reply("You have unclaimed the order.");
	},
};
