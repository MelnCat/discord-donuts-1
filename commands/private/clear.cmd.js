const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders } = require("../../sequelize");
const { isBotOwner } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("clear")
		.setDescription("Deletes all orders.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			const deletedOrders = await Orders.destroy({ where: {} });
			if (deletedOrders) {
				const doneEmbed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Clear")
						.setDescription("All orders deleted!")
						.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

				return message.channel.send(doneEmbed);
			}

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Clear")
					.setDescription("An error occured!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

			message.channel.send(embed);
		});

