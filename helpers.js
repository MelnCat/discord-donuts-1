const snekfetch = require("node-superfetch");

const DDEmbed = require("./structures/DDEmbed.struct");

const { Orders, Op } = require("./sequelize");

const {
	channels: { kitchenChannel, deliveryChannel },
	botlists: {
		discordbotsToken,
		discordpwToken,
		discordlistToken,
		listcordToken
	}
} = require("./auth.json");

const timeout = delay => new Promise(resolve => setTimeout(resolve, delay));

const generateID = length => {
	let pos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";
	let str = 0;
	for (let i = 0; i < length; i++) {
		str += pos.charAt(Math.floor(Math.random() * pos.length));
	}
	return str;
};

/* eslint-disable indent, no-mixed-spaces-and-tabs */

const status = code => {
			 if (code === 0) return "Unclaimed";
	else if (code === 1) return "Claimed";
	else if (code === 2) return "Cooking";
	else if (code === 3) return "Cooked";
	else if (code === 4) return "Delivered";
	else if (code === 5) return "Deleted";
	else if (code === 6) return "Expired";
	else if (code === 7) return "Cancelled";
	else throw TypeError("That isn't a valid code");
};

/* eslint-enable indent, no-mixed-spaces-and-tabs */

const generateTicket = (client, order) => {
	const user = client.users.get(order.get("user"));
	const channel = client.channels.get(order.get("channel"));
	return new DDEmbed(client)
		.setStyle("white")
		.setTitle("🎫 New Ticket")
		.setDescription(`${user.username}#${user.discriminator} (${user.id}) would like a donut!`)
		.addField("Donut Description", order.get("description"))
		.addField(":hash: Ticket ID", order.get("id"))
		.addField(":computer: Guild Information", `This ticket came from ${channel.guild.name} (${channel.guild.id}) in ${channel.name} (${channel.id}).`)
		.addField(":white_check_mark: Ticket Status", status(order.get("status")));
};

const autoDeliver = async(client, id) => {
	const finalOrder = await Orders.findOne({ where: { id: id, status: 3 } });
	if (!finalOrder) return;

	const channel = client.channels.get(finalOrder.get("channel"));
	const user = channel.guild.members.get(finalOrder.get("user"));
	const url = finalOrder.get("url");

	channel.send(`${user}, here's your order! I know you love this bot. In case you didn't know, upkeeping a bot takes money. You can help keep us operating and our gears running smooth by being a patron over at https://patreon.com/discorddonuts. If you want to provide feedback, please use d!feedback. If you want to leave a tip, use d!tip. ${url}`);

	await finalOrder.update({ status: 4 });
};

const messageAlert = async(client, text, channel = kitchenChannel) => {
	text = text.replace("[orderCount]", await Orders.count({ where: { status: { [Op.lt]: 2 } } }));
	const embed =
		new DDEmbed(client)
			.setStyle("colorful")
			.setTitle("Alert")
			.setDescription(text)
			.setThumbnail("https://images.emojiterra.com/twitter/512px/2757.png");
	client.channels.get(channel).send(embed);
};

const updateWebsites = client => {
	const serverCount = client.guilds.size;
	console.log("[Discord] Updating websites...");
	snekfetch.post(`https://discordbots.org/api/bots/335637950044045314/stats`)
		.set("Authorization", discordbotsToken)
		.send({ server_count: serverCount })
		.then(console.log("[Discord] Updated discordbots.org stats."))
		.catch(e => console.log("[Discord] ", e.body));
	snekfetch.post(`https://bots.discord.pw/api/bots/335637950044045314/stats`)
		.set("Authorization", discordpwToken)
		.send({ server_count: serverCount })
		.then(console.log("[Discord] Updated bots.discord.pw stats."))
		.catch(e => console.log("[Discord] ", e.body));
	snekfetch.post(`https://bots.discordlist.net/api`)
		.set("Authorization", discordlistToken)
		.send({ server_count: serverCount })
		.then(console.log("[Discord] Updated bots.discordlist.net stats."))
		.catch(e => console.log("[Discord] ", e.body));
	snekfetch.post(`https://listcord.com/api/bot/335637950044045314/guilds`)
		.set("Content-Type", "application/json")
		.set("token", listcordToken)
		.send({ guilds: serverCount })
		.then(console.log("[Discord] Updated Listcord stats."))
		.catch(e => console.log("[Discord] ", e.body));
};

const checkOrders = client => {
	setInterval(async() => {
		const cookingOrders = await Orders.findAll({ where: { status: { [Op.lt]: 5 } } });
		cookingOrders.forEach(async order => {
			if (order.status < 2) {
				if (order.timeLeft < 1) {
					await order.update({ status: 6 });
					return client.users.get(order.user).send("Your order has expired, please try again");
				}

				await order.decrement("timeLeft", { by: 1 });
			} else if (order.status === 2) {
				if (order.cookTimeLeft < 1) {
					await order.update({ status: 3 });
					await client.users.get(order.user).send("Your order has been cooked. It will be delivered in a few minutes");
					return client.channels.get(deliveryChannel).send(`${client.users.get(order.claimer)}, ticket \`${order.id}\` has completed cooking and is ready to be delivered!`);
				}

				await order.decrement("cookTimeLeft", { by: 1 });
			} else if (order.status === 3) {
				if (order.deliveryTimeLeft < 1) {
					await autoDeliver(client, order.id);
					return order.update({ status: 4 });
				}

				await order.decrement("deliveryTimeLeft", { by: 1 });
			}
		});
	}, 60000);
};

module.exports = {
	generateID,
	status,
	generateTicket,
	timeout,
	autoDeliver,
	updateWebsites,
	messageAlert, 
	checkOrders
};
