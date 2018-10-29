const { Orders, Op } = require("../../sequelize");

const { canCook } = require("../../permissions");

const { status } = require("../../helpers");

const DDCommand = require("../../structures/DDCommand.struct");

module.exports =
        new DDCommand()
                .setName("list")
                .setPermissions(canCook)
                .setDescription("Lists all available donuts.")
                .setFunction(async(message, args, client) => {
                        const ordersList = await Orders.findAll({ where: { status: { [Op.lt]: 4 } }, attributes: ["id", "status", "claimer"] });

                        const ordersFormatted = ordersList.map(t => `\n\`${t.id}\` - ${status(t.status)} ${t.status ==2?"by "+client.users.get(t.claimer).tag:""}`).join("") || "";
                        message.channel.send(`Current orders: ${ordersList.length == 0? "\nNone.":ordersFormatted}`);
                });
