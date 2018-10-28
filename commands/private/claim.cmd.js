const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders } = require("../../sequelize");
const { canCook } = require("../../permissions");
const { channels: { kitchenChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("claim")
		.setDescription("Use this to claim donut orders.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!canCook(message.member)) return;
			if (message.channel.id !== kitchenChannel) return message.channel.send("You can only run this command in the kitchen");
			if (!args[0]) return "Make sure to include the Ticket ID!";

			const order = await Orders.findOne({ where: { id: args.shift(), claimer: null } });
			if (!order) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Claim")
						.setDescription("Couldn't find that order or it has already been claimed.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			await order.update({ status: 1, claimer: message.author.id });

			await client.users.get(order.get("user")).send(`Guess what? Your ticket has now been claimed by **${message.author.username}**! It should be cooked shortly.`);

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Claim")
					.setDescription("You have claimed the order.")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(embed);
		});

