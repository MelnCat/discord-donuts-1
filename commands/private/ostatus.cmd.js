const { Orders } = require("../../sequelize");

const { status } = require("../../helpers");

const { canCook } = require("../../permissions");

module.exports = {
	name: "ostatus",
	permissions: canCook,
	description: "Lists info about a specific order.",
	async execute(message, args, client) {
		const order = await Orders.findOne({ where: { id: args.shift() } });
		if (!order) { message.reply("Couldn't find that order."); } else {
			message.author.send({ embed: {
				title: "Ticket Status",
				description: "The status of this ticket.",
				fields: [{
					name: ":ash: Ticket ID",
					value: order.get("id"),
				}, {
					name: "Donut Description",
					value: order.get("description"),
				}, {
					name: ":white_check_mark: Ticket Status",
					value: status(order.get("status")),
				}, {
					name: ":computer: Guild Information",
					value: `This ticket came from ${client.channels.get(order.get("channel")).guild.name} (${client.channels.get(order.get("channel")).guild.id}) in #${client.channels.get(order.get("chanel")).name} (${order.get("chanel")}).`,
				}],
			} });
		}
	},
};
