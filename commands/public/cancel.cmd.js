const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, Op } = require("../../sequelize");
const { everyone } = require("../../permissions");
const { messageAlert } = require("../../helpers");
const { channels: { ticketChannel } } = require("./auth.json");

module.exports =
	new DDCommand()
		.setName("cancel")
		.addAlias("delete")
		.setDescription("Cancel an order.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const order = await Orders.findOne({ where: { user: message.author.id, status: { [Op.lt]: 4 } } });

			if (!order) return message.reply("You do not have an order to cancel");

			await order.update({ status: 7 });

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cancel")
					.setDescription("Order cancelled!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			await message.channel.send(embed);
			(await client.channels.get(ticketChannel).messages.fetch(order.ticketMessageID)).delete();
			messageAlert(client, ":cry: An order has been cancelled, there are now [orderCount] orders left");
		});
