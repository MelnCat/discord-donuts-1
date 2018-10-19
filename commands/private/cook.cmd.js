const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo } = require("../../sequelize");
const { timeout, autoDeliver } = require("../../helpers");
const { canCook } = require("../../permissions");
const { deliveryChannel } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("cook")
		.setDescription("Use this to cook donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			const id = args.shift();
			const order = await Orders.findOne({ where: { id: id, claimer: message.author.id } });
			const worker = await WorkerInfo.findOne({ where: { id: message.author.id } });

			if (!order) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Cook")
						.setDescription("Either this order doesn't exist, or you haven't claimed it.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			// TODO: Support non URL image
			const urlEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cook")
					.setDescription("The next message you send will be set as the order's image Only URLs are supported atm :cry:.");

			message.channel.send(urlEmbed);

			const response = await message.channel.awaitMessages(m => m.author.id === order.get("claimer"), { max: 1, time: 30000 });

			if (!response.size) {
				// TODO: Support non URL image
				const notInTimeEmbed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Cook")
						.setDescription("You didn't respond in time.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(notInTimeEmbed);
			}
			if (!response.first().attachments.array()) {
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
				} else if (response.first().attachments.url.endsWith("png") || response.first().attachments.url.endsWith("jpg") || response.first().attachments.url.endsWith("jpeg") || response.first().attachments.url.endsWith("webp")) {
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

			await timeout(180000);

			await client.users.get(order.user).send("Your donut has finished cooking and will be delivered shortly.");

			await client.channels.get(deliveryChannel).send(`${client.users.get(order.claimer)}, ticket \`${order.id}\` has completed cooking and is ready to be delivered!`);

			await Orders.update({ status: 3 }, { where: { id: id }, individualHooks: true });

			await timeout(180000);

			autoDeliver(client, id);
		});
