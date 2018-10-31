const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo } = require("../../sequelize");
const { timeout, autoDeliver, messageAlert } = require("../../helpers");
const { canCook } = require("../../permissions");
const { channels: { kitchenChannel, deliveryChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("cook")
		.addAlias("bake")
		.setDescription("Use this to cook donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (message.channel.id !== kitchenChannel) return message.channel.send(":x: You can only do this command in the kitchen!");
			if (!args[0]) return message.channel.send("Make sure to include the Ticket ID!");

			const id = args.shift();
			const order = await Orders.findOne({ where: { id: id, claimer: message.author.id } });
			const worker = await WorkerInfo.findOne({ where: { id: message.author.id } });

			if (!order) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Cook")
						.setDescription("That order doesn't exist")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			if (order.status > 1) return message.channel.send("That order is already cooking");

			const urlEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cook")
					.setDescription("The next message you send will be set as the order's image");

			message.channel.send(urlEmbed);

			const response = await message.channel.awaitMessages(m => m.author.id === order.get("claimer"), { max: 1, time: 30000 });

			if (!response.size) {
				const notInTimeEmbed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Cook")
						.setDescription("You didn't respond in time.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(notInTimeEmbed);
			}
			if (!response.first().attachments.array().length) {
				try {
					await Orders.update({ status: 2, url: response.first().content }, { where: { id: id }, individualHooks: true });
				} catch (e) {
					if (e.name === "SequelizeValidationError") {
						// TODO: Add better error detection
						const embed =
							new DDEmbed(client)
								.setStyle("white")
								.setTitle("Cook")
								.setDescription("That doesn't look like a URL to me.")
								.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

						return message.channel.send(embed);
					}
				}
			} else if (["png", "jpeg", "jpg", "webp"].some(value => response.first().attachments.first().url.endsWith(value))) {
				await Orders.update({ status: 2, url: response.first().attachments.first().url }, { where: { id: id }, individualHooks: true });
			} else {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Cook")
						.setDescription("That doesn't look like a image file to me.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}
			const cookEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cook")
					.setDescription("Your donut will take 3 minutes to cook.")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(cookEmbed);

			if (!worker) {
				await WorkerInfo.create({
					id: message.author.id,
					cooks: 1,
					delivers: 0,
					lastCook: Date.now(),
					lastDeliver: 0,
				});
			} else {
				worker.update({ cooks: worker.cooks + 1, lastCook: Date.now() });
			}

			client.users.get(order.user).send(`:thumbsup: Your cook, ${client.users.get(order.claimer).username}, just put your ticket in the oven! It should take **3 minutes** to cook!`);

			message.channel.send(`:thumbsup: Alright, you've put \`${order.id}\` into the oven. It'll take **3 minutes** to cook.`);

			await timeout(180000);

			messageAlert(client, "Another order has been cooked and there are now [orderCount] orders left");

			await client.users.get(order.user).send("Your donut has finished cooking and will be delivered shortly.");

			await client.channels.get(deliveryChannel).send(`${client.users.get(order.claimer)}, ticket \`${order.id}\` has completed cooking and is ready to be delivered!`);

			await Orders.update({ status: 3 }, { where: { id: id }, individualHooks: true });

			await timeout(180000);

			autoDeliver(client, id);
		});
