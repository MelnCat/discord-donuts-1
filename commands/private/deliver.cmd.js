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
			const workerraw = await WorkerInfo.findOrCreate({ where: { id: message.author.id }, defaults: { id: message.author.id, cooks: 0, delivers: 0, lastCook: 0, lastDeliver: 0 } });
			const worker = workerraw[0];
			await worker.update({ delivers: worker.delivers + 1, lastDeliver: Date.now() });
			let milestones = { 100: "500818730788585482", 250: "500818668972933140", 500: "500818727756103680", 750: "500818673720754178", 1000: "500818665860759563" };
			const member = client.guilds.get("294619824842080257").members.get(worker.id);
			for (let i = 0; i < Object.keys(milestones).length; i++) {
				let m = Object.keys(milestones)[i];
				if (worker.cooks + worker.delivers >= m) {
					if (member.roles.some(role => role.id == milestones[m])) return;
					member.roles.add(milestones[m]);
				}
			}
		});
