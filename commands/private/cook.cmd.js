const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo } = require("../../sequelize");
const { timeout, autoDeliver, messageAlert } = require("../../helpers");
const { canCook } = require("../../permissions");
const { channels: { kitchenChannel, deliveryChannel } } = require("../../auth.json");

const isurl = require("isurl");

module.exports =
	new DDCommand()
		.setName("cook")
		.addAlias("bake")
		.setDescription("Use this to cook donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.reply("Please provide an id to cook");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) message.reply("Please provide a valid id");

			const order = await Orders.findById(args[0]);
			if (!order) return message.reply("That order doesn't exist");
			if (order.claimer !== message.author.id) return message.reply("You have not claimed that order");

			if (order.status > 2) return message.channel.send("That order is already cooked");
			if (order.status === 2) return message.channel.send("That order is currently cooking");

			const urlEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cook")
					.setDescription("The next message you send will be set as the order's image");

			message.channel.send(urlEmbed);

			const response = await message.channel.awaitMessages(m => m.author.id === order.claimer, { max: 1, time: 30000 });

			if (response.size === 0) message.reply("You did not reply in time");
			if (response.first().attatchments.size > 0) {
				if (!isurl(response.first().attatchments.first().url) && !response.first().attatchments.first().url.match(/(png|jpeg|jpg|gif|webp)$/)) return message.reply("That doesn't look like a valid image url");

				await Orders.update({ status: 2, url: response.first().attatchments.first().url }, { where: { id: args[0] }, individualHooks: true });
			} else if (isurl(response.first().content)) await Orders.update({ status: 2, url: response.first().attatchments.first().url }, { where: { id: args[0] }, individualHooks: true }); // eslint-disable-line curly

			const cookEmbed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Cook")
					.setDescription("Your donut will take 3 minutes to cook.")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			message.channel.send(cookEmbed);

			client.users.get(order.user).send(`:thumbsup: Your cook, ${client.users.get(order.claimer).tag}, just put your ticket in the oven! It should take **3 minutes** to cook!`);

			message.channel.send(`:thumbsup: Alright, you've put \`${order.id}\` into the oven. It'll take **3 minutes** to cook.`);
		});
