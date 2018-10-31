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
			if (!args[0]) return message.reply("Please provide an id");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}/)) return message.reply("That doesn't look like a valid id");

			const order = await Orders.findById(args[0]);
			if (!order) return message.reply("Couldn't find that order");
			if (order.claimer !== message.author.id) return message.reply("You haven't claimed this order");

			await order.update({ status: 0, claimer: null });

			await client.users.get(order.user).send(`Sadly, **${message.author.username}** has unclaimed your order.`);

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Unclaim")
					.setDescription("You have unclaimed the order.")
					.setThumbnail("https://mbtskoudsalg.com/images/trash-can-emoji-png-5.png");

			message.channel.send(embed);
		});
