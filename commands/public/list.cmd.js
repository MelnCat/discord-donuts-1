const { Orders, Op } = require("../../sequelize");

const { canCook } = require("../../permissions");

const DDCommand = require("../../structures/DDCommand.struct");

module.exports =
	new DDCommand()
		.setName("list")
		.setPermissions(canCook)
		.setDescription("Lists all available donuts.")
		.setFunction(async(client, args, message) => {
			const ordersList = await Orders.findAll({ where: { status: { [Op.lt]: 5 } }, attributes: ["id"] });
			const ordersFormatted = ordersList.map(t => `\n\`${t.id}\``).join("") || "";
			message.channel.send(`Current orders: ${ordersFormatted}`);
		});
