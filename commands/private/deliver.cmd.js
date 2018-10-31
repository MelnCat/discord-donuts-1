const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo } = require("../../sequelize");
const { canCook } = require("../../permissions");
const { channels: { deliveryChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("deliver")
		.setDescription("Use this to deliver cooked donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (message.channel.id !== deliveryChannel) return message.reply("You can only use this command in the delivery channel");
			if (!args[0]) return message.reply("You need to provide an id");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.reply("That is not a valid id");

			const order = await Orders.findById(args.shift());
			if (!order) return message.channel.send("Couldn't find that order");

			if (order.status > 3) return message.reply("This order has already been delivered");
			if (order.status < 3) return message.reply("This order has not been cooked yet");

			await order.update({ status: 4 });

			const invite = await client.channels.get(order.channel).createInvite({
				maxAge: 86400,
				maxUses: 1,
				unique: true,
			});

			const orderEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Delivery Info")
					.addField("Ticket Description", order.description)
					.addField("User Information", `${client.users.get(order.user).tag} (${order.user}) in #${client.channels.get(order.channel).name} (${order.channel}).`)
					.addField("Cook's Image", order.url);

			await message.author.send(orderEmbed);
			await message.author.send(invite.url);

			const dmEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Deliver")
					.setDescription("I have DMed you the order information")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4e9.png");
			await message.reply(dmEmbed);
		});
