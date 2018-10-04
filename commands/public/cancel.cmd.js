const { Orders, Op } = require("../../sequelize");

const { everyone } = require("../../permissions");

module.exports = {
	name: "cancel",
	description: "Cancel an order.",
	permissions: everyone,
	async execute(message, args) {
		const deletedOrdersCount = await Orders.update({ status: 6 }, { where: { user: message.author.id, status: { [Op.lt]: 5 } }, individualHooks: true });
		if (deletedOrdersCount[0] < 1) return message.reply("You don't have any orders to cancel.");
		console.log(deletedOrdersCount);
		message.reply("Order cancelled!");
	},
};
