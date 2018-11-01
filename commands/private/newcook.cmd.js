const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo, PrecookedDonuts } = require("../../sequelize");
const { timeout, autoDeliver, messageAlert } = require("../../helpers");
const { canCook } = require("../../permissions");
const { channels: { kitchenChannel, deliveryChannel } } = require("../../auth.json");

const isurl = require("isurl");

module.exports =
	new DDCommand()
		.setName("newcook")
		.addAlias("newbake")
		.setDescription("Use this to cook donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.reply("Please provide an id to cook");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.reply("Please provide a valid id");

			const order = await Orders.findById(args[0]);
			if (!order) return message.reply("That order doesn't exist");
			if (order.claimer !== message.author.id) return message.reply("You haven't claimed this order");

			if (order.status === 2) return message.reply("That order is currently cooking");
			if (order.status > 2) return message.reply("That order has already been cooked");

			let url;

			const precookedDonuts = await PrecookedDonuts.findAll({ where: { name: order.description } });
			if (precookedDonuts.length > 0) {
				const randomDonut = precookedDonuts[Math.floor(Math.random() * precookedDonuts.length)];
				message.reply(`I found a precooked donut for you. Reply yes to use it, or no to use your own. \n ${randomDonut.url}`);

				const response = await message.channel.awaitMessages(
					m => m.author.id === order.claimer &&
					m.content.toLowerCase().match(/(yes|no)/),
					{ max: 1, time: 30000 });

				if (response.size && response.first().content.includes("yes")) url = randomDonut.url;
			}

			if (!url) {
				const urlEmbed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Cook")
						.setDescription("The next message you send will be set as the order's image");

				await message.channel.send(urlEmbed);

				const response = await message.channel.awaitMessages(
					m => m.author.id === order.claimer,
					{ max: 1, time: 30000 });

				if (!response.size) return message.reply("You didn't respond in time, cancelling cook");

				if (isurl(response.first().content.trim())) url = response.first().content.trim();
				else if (response.first().attachments.size) url = response.first().attachments.first().url;
				else return message.reply("That doesn't look like an image");

				if (!await PrecookedDonuts.findOne({ where: { name: order.description.toLowerCase(), url } })) {
					await message.reply(`Would you like to add this image to our precooked collection as a \`${order.description.toLowerCase()}\`?`);
					const response = await message.channel.awaitMessages(
						m => m.author.id === order.claimer &&
						m.content.toLowerCase().match(/(yes|no)/),
						{ max: 1, time: 30000 });

					if (response.first().channel.includes("yes")) {
						await PrecookedDonuts.create({ name: order.description.toLowerCase(), url });
						message.reply("Your donut has been put into the collection. :thumbs_up");
					}
				}
			}

			await order.update({ status: 3 });

			const cookEmbed =
			new DDEmbed(client)
				.setStyle("white")
				.setTitle("Cook")
				.setDescription("Your donut will take 3 minutes to cook.")
				.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			await message.channel.send(cookEmbed);
			await client.users.get(order.user).send(`:thumbsup: Your cook, ${client.users.get(order.claimer).tag}, just put your ticket in the oven! It should take **3 minutes** to cook!`);
		});
