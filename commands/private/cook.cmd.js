const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo, MonthlyInfo, PrecookedDonuts } = require("../../sequelize");
const { timeout, autoDeliver, messageAlert, isurl } = require("../../helpers");
const { canCook } = require("../../permissions");
const { channels: { kitchenChannel, deliveryChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("cook")
		.addAlias("bake")
		.setDescription("Use this to cook donuts.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.reply("Please provide an ID to a valid ticket.");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.reply("That ID isn't valid, please try again.");

			const order = await Orders.findById(args[0]);
			if (!order) return message.reply("That order doesn't exist");
			if (order.claimer !== message.author.id) return message.reply("You are unauthorized to access this order. This may be due to you not being the baker.");

			if (order.status === 2) return message.reply("That order is currently being cooked, please check back later.");
			if (order.status > 2) return message.reply("That order has completed cooking.");

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
						.setDescription("The next message you send will be set as the order's image.");

				await message.channel.send(urlEmbed);

				const response = await message.channel.awaitMessages(
					m => m.author.id === order.claimer,
					{ max: 1, time: 30000 });

				if (!response.size) return message.reply("Cook sequence failed, please try again.");

				if (isurl(response.first().content.trim())) url = response.first().content.trim();
				else if (response.first().attachments.size) url = response.first().attachments.first().url;
				else return message.reply("That doesn't look like an image");

				if (!await PrecookedDonuts.findOne({ where: { name: order.description.toLowerCase(), url } })) {
					await message.reply(`Would you like to add this image to our precooked collection as a \`${order.description.toLowerCase()}\`?`);
					const response = await message.channel.awaitMessages(
						m => m.author.id === order.claimer &&
						m.content.toLowerCase().match(/(yes|no)/),
						{ max: 1, time: 30000 });

					if (response.first().content.includes("yes")) {
						await PrecookedDonuts.create({ name: order.description.toLowerCase(), url });
						message.reply("Your donut has been put into the collection. :thumbs_up");
					}
				}
			}

			await order.update({ status: 2, url });

			const cookEmbed =
			new DDEmbed(client)
				.setStyle("white")
				.setTitle("Cook")
				.setDescription("Your donut will take 3 minutes to cook.")
				.setThumbnail("https://images.emojiterra.com/twitter/512px/2705.png");

			await message.channel.send(cookEmbed);
			await client.users.get(order.user).send(`:thumbsup: Your cook, ${client.users.get(order.claimer).tag}, just put your order into the oven! It should take **3 minutes** to cook!`);
			const workerraw = await WorkerInfo.findOrCreate({ where: { id: message.author.id }, defaults: { id: message.author.id, cooks: 0, delivers: 0, lastCook: 0, lastDeliver: 0, username: message.author.tag, lastCookIds: "[]", lastDeliverIds: "[]" } });
			const worker = workerraw[0];
			const r = JSON.parse(worker.lastCookIds);
			r.push(order.user);
			const rr = JSON.stringify(r);
			await worker.update({ cooks: worker.cooks + 1, lastCook: Date.now(), lastCookIds: rr });
			const monthlyraw = await MonthlyInfo.findOrCreate({ where: { id: message.author.id }, defaults: { id: message.author.id, cooks: 0, delivers: 0, username: message.author.tag } });
			const monthly = monthlyraw[0];
			await monthly.update({ cooks: monthly.cooks + 1 });
			let milestones = { 100: "500818730788585482", 250: "500818668972933140", 500: "500818727756103680", 750: "500818673720754178", 1000: "500818665860759563" };
			const member = client.guilds.get("294619824842080257").members.get(worker.id);
			for (let i = 0; i < Object.keys(milestones).length; i++) {
				let m = Object.keys(milestones)[i];
				if (worker.cooks + worker.delivers >= m) {
					if (!member.roles.some(role => role.id === milestones[m])) {
						member.roles.add(milestones[m]);
					}
				}
			}
		});
