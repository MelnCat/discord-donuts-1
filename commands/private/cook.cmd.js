const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, WorkerInfo, MonthlyInfo, PrecookedDonuts } = require("../../sequelize");
const { timeout, autoDeliver, messageAlert, isurl } = require("../../helpers");
const { canCook } = require("../../permissions");
const { channels: { kitchenChannel, deliveryChannel } } = require("../../auth.json");
const random = ["Can you taste it already?", "Smells good!", "It'll be amazing.", "You can smell it from here.", "That smells good!", "Can you taste it yet?"];
const randomstatus = random[Math.round(Math.random() * (random.length - 1))];

module.exports =
	new DDCommand()
		.setName("cook")
		.addAlias("bake")
		.setDescription("Use this to cook donuts.")
		.setPermissions(canCook)
		.setFunction(async (message, args, client) => {
			if (!args[0]) return message.channel.send("Please provide an ID to a valid ticket.");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.channel.send("That ID isn't valid, please try again.");

			const order = await Orders.findById(args[0]);
			if (!order) return message.channel.send("That order doesn't exist");
			if (order.claimer !== message.author.id) return message.channel.send("You are unauthorized to access this order. This may be due to you not being the baker.");

			if (order.status === 2) return message.channel.send("That order is currently being cooked, please check back later.");
			if (order.status > 2) return message.channel.send("That order has completed cooking.");

			let url;

			const precookedDonuts = await PrecookedDonuts.findAll({ where: { name: order.description } });
			if (precookedDonuts.length > 0) {
				const randomDonut = precookedDonuts[Math.floor(Math.random() * precookedDonuts.length)];
				message.channel.send(`I found a precooked donut for you. Reply yes to use it, or no to use your own. \n ${randomDonut.url}`);

				const response = await message.channel.awaitMessages(
					m => m.author.id === order.claimer &&
						m.content.toLowerCase().match(/(yes|no)/),
					{ max: 1, time: 30000 });

				if (response.size && response.first().content.includes("yes")) url = randomDonut.url;
			}

			if (!url) {
				const urlEmbed =
					new DDEmbed(client)
						.setStyle("blank")
						.setTitle("Cook Wizard")
						.setURL("https://discordapp.com/oauth2/authorize?client_id=335637950044045314&scope=bot&permissions=84993")
						.setDescription("**The next message you send will be set as the order's image.**")
						.setFooter(message.author.tag, message.author.displayAvatarURL())

				await message.channel.send(urlEmbed);

				const response = await message.channel.awaitMessages(
					m => m.author.id === order.claimer,
					{ max: 1, time: 30000 });

				if (!response.size) return message.channel.send("Cook sequence failed, please try again.");

				if (isurl(response.first().content.trim())) url = response.first().content.trim();
				else if (response.first().attachments.size) url = response.first().attachments.first().url;
				else return message.channel.send("That doesn't look like an image");

				if (!await PrecookedDonuts.findOne({ where: { name: order.description.toLowerCase(), url } })) {
					await message.channel.send(`Would you like to add this image to our precooked collection as a \`${order.description.toLowerCase()}\`?`);
					const response = await message.channel.awaitMessages(
						m => m.author.id === order.claimer &&
							m.content.toLowerCase().match(/(yes|no)/),
						{ max: 1, time: 30000 });

					if (response.first().content.includes("yes")) {
						await PrecookedDonuts.create({ name: order.description.toLowerCase(), url });
						message.channel.send("<:yes:501906738119835649> **Successfully added to your collection.**");
					}
				}
			}

			await order.update({ status: 2, url });

			const cookEmbed =
				new DDEmbed(client)
					.setStyle("blank")
					.setTitle("Cook Wizard")
					.setURL("https://discordapp.com/oauth2/authorize?client_id=335637950044045314&scope=bot&permissions=84993")
					.setDescription("<:yes:501906738119835649> **Your request has been acknowledged. This order will take `3` minutes to cook.**")
					.setFooter(message.author.tag, message.author.displayAvatarURL())

			const cookedEmbed =
				new DDEmbed(client)
					.setStyle("blank")
					.setDescription(`**${randomstatus} \`${message.author.tag}\` has put your order in the oven, it'll take 3 minutes to cook.**`)
					.setFooter(message.author.tag, message.author.displayAvatarURL())

			await message.channel.send(cookEmbed);
			await client.users.get(order.user).send(cookedEmbed);
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
