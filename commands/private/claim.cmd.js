const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders } = require("../../sequelize");
const { canCook } = require("../../permissions");
const { messageAlert } = require("../../helpers");
const { channels: { kitchenChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("claim")
		.setDescription("Use this to claim donut orders.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (message.channel.id !== kitchenChannel) return message.reply("You can only run this command in the kitchen");

			if (!args[0]) return message.reply("Please provide an id to claim");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.reply("That doesn't look like a valid id");

			const order = await Orders.findById(args.shift());
			if (!order) return message.reply("I couldn't find that order");
			if (order.claimer != null) return message.reply("This order has already been claimed");

			await order.update({ status: 1, claimer: message.author.id });

			await client.users.get(order.user).send(`Guess what? Your ticket has now been claimed by **${message.author.tag}**! It should be cooked shortly.`);

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Claim")
					.setDescription("You have claimed the order.")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			await message.channel.send(embed);

			await messageAlert(client, "An order has just been claimed, there are now [orderCount] orders left");
		});

