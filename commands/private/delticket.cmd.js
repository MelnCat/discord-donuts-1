const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, Op } = require("../../sequelize");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("delticket")
		.setDescription("Delete unworthy tickets, with a reason.")
		.setPermission(canCook)
		.setFunction(async(message, args, client) => {
			if (!args) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Delete Ticket")
						.setDescription("Please enter an order id.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			const deletedOrdersCount = await Orders.update({ status: 5 }, { where: { id: args.shift(), status: { [Op.lt]: 5 } }, individualHooks: true });
			if (deletedOrdersCount[0] < 1) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Delete Ticket")
						.setDescription("Couldn't find that order!")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Delete Ticket")
					.setDescription(`Ticket deleted!`)
					.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

			message.channel.send(embed);
		});
