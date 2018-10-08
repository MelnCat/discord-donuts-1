const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo } = require("../../sequelize");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("deliver")
		.setDescription("Use this to deliver cooked donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			const order = await Orders.findOne({ where: { id: args.shift() } });
			const worker = await WorkerInfo.findOne({ where: { id: message.author.id } });

			if (!order) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Deliver")
						.setDescription("Couldn't find that order!")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}
			await order.update({ status: 4 });

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Deliver")
					.setDescription("Order information send to the DMs!")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4e9.png");

			message.reply(embed);

			const invite = client.channels.get(order.get("channel")).createInvite({
				maxAge: 86400,
				maxUses: 1,
				unique: true,
			});

			const orderEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Delivery Info")
					.setDescription("The ticket has been deleted, it's all on you now.")
					.addField("Ticket Description", order.get("description"))
					.addField("User Information", `${client.users.get(order.get("user").name)} (${order.get("user")}) in #${client.channels.get(order.get("channel").name)} (${order.get("channel")}).`)
					.addField("Cook's Image", order.get("url"));

			message.author.send(orderEmbed + invite.url);

			if (!worker) {
				await WorkerInfo.create({
					id: message.author.id,
					cooks: 0,
					delivers: 1,
					lastCook: 0,
					lastDeliver: Date.now(),
				});
			} else {
				worker.update({ delivers: worker.delivers + 1, lastDeliver: Date.now() });
			}
		});
