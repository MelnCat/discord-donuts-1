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
			const order = Orders.findOne({ where: { user: message.author.id } });

			if (!order) return message.reply("You do not have an order to cancel");

			await order.update({status: 7});

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cancel")
					.setDescription("Order cancelled!")
					.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

			message.channel.send(embed);

			messageAlert(client, ":cry: An order has been cancelled, there are now [orderCount] orders left");
		});
