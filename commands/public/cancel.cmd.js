const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, Op } = require("../../sequelize");
const { everyone } = require("../../permissions");
const { messageAlert } = require("../../helpers");

module.exports =
	new DDCommand()
		.setName("cancel")
		.setDescription("Cancel an order.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const deletedOrdersCount = await Orders.update({ status: 6 }, { where: { user: message.author.id, status: { [Op.lt]: 5 } }, individualHooks: true });

			if (deletedOrdersCount[0] < 1) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Couldn't Cancel Your Order")
						.setDescription("Your order couldn't be canceled.")
						.addField("Reason", "You don't have any orders to cancel.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cancel")
					.setDescription("Order cancelled!")
					.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

			messageAlert(":cry: An order has been cancelled, there are now [orderCount] orders left");
			return message.channel.send(embed);
		});
