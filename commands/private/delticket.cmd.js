const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, Op } = require("../../sequelize");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("delticket")
		.setDescription("Delete tickets.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.reply("Please provide an id");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}/)) return message.reply("That doesn't look like a valid id");
			if (!args[1]) return message.reply("Please provide a reason");

			const order = await Orders.findById(args[0]);

			if (!order) return message.reply("Couldn't find that order");
			if (order.status === 4) return message.reply("That order has been delivered");
			if (order.status > 4) return message.reply("That order has already been deleted");

			await order.update({ status: 5 });

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Delete Ticket")
					.setDescription(`Ticket deleted!`)
					.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

			message.channel.send(embed);
		});
