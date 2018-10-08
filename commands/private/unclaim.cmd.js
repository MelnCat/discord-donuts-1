const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders } = require("../../sequelize");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("unclaim")
		.setDescription("Use this to unclaim donut orders.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!canCook(message.member)) return;

			const order = await Orders.findOne({ where: { id: args.shift(), claimer: message.author.id } });
			if (!order) return message.reply("Couldn't find that order or you don't have it claimed.");

			await order.update({ status: 0, claimer: null });

			await client.users.get(order.get("user")).send(`Sadly, your order has been unclaimed by **${message.author.username}**.`);

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Unclaim")
					.setDescription("You have unclaimed the order.")
					.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

			message.channel.send(embed);
		});
