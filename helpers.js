const { post } = require("node-superfetch");

const DDEmbed = require("./structures/DDEmbed.struct");

const { Orders, Op, Applications } = require("./sequelize");
const empty = "​";
const { employeeRole } = require("./auth.json");
const {
	channels: { applicationChannel, kitchenChannel, deliveryChannel },
	botlists: {
		discordbotsToken,
		discordpwToken,
		discordlistToken,
		listcordToken
	}
} = require("./auth.json");

const timeout = delay => new Promise(resolve => setTimeout(resolve, delay));

const calcUptime = int => {
	let time = 0;
	let days = 0;
	let hrs = 0;
	let min = 0;
	let sec = 0;
	let temp = Math.floor(int / 1000);
	sec = temp % 60;
	temp = Math.floor(temp / 60);
	min = temp % 60;
	temp = Math.floor(temp / 60);
	hrs = temp % 24;
	temp = Math.floor(temp / 24);
	days = temp;
	const upText = `${days} Days, ${hrs} hours, ${min} minutes, ${sec} seconds.`;
	return upText;
};
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
		.setTitle(" New Ticket")
		.setDescription(`${user.username}#${user.discriminator} (${user.id}) would like a donut!`)
		.addField("Donut Description", order.get("description"))
		.addField(":hash: Ticket ID", order.get("id"))
		.addField(":computer: Guild Information", `This ticket came from ${channel.guild.name} (${channel.guild.id}) in ${channel.name} (${channel.id}).`)
		.addField(":white_check_mark: Ticket Status", `${status(order.get("status"))}${order.get("status") === 1?`by ${client.users.get(order.get("claimer")).tag}`:""}`);
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
	text = text.replace("[orderCount]", await Orders.count({ where: { status: { [Op.lt]: 1 } } }));
	let unclaimed = await Orders.count({ where: { status: { [Op.lt]: 1 } } });

	if (unclaimed % 3 === 0 && client.lastPing !== unclaimed) {
		if (unclaimed !== 0) {
			client.channels.get(channel).send(`<@&${employeeRole}>`);
		}
		client.lastPing = unclaimed;
	}
	const embed =
		new DDEmbed(client)
			.setStyle("colorful")
			.setTitle("Alert")
			.setDescription(text)
			.setThumbnail("https://images.emojiterra.com/twitter/512px/2757.png");
	client.channels.get(channel).send(embed);
};
const getInput = async(message, display) => {
	const userid = message.author.id;
	const channel = message.channel;
	await channel.send(display);
	let v = await channel.awaitMessages(m => m.author.id === userid, { max: 1, time: 20000 });
	if (v.size === 0) {
		channel.send("You did not provide me with a value so I cancelled this session.");
		return false;
	}
	let vv = v.first().content;
	return vv;
};
const getReactions = async(message, display, reactions) => {
	const userid = message.author.id;
	const channel = message.channel;
	const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === userid;
	let reactMessage = await channel.send(display);
	for (const r of reactions) {
		if (!client.emojis.find(emoji => emoji.name === r)) {
			reactMessage.react(r);
		} else {
			reactMessage.react(client.emojis.find(emoji => emoji.name === r));
		}
	}
	const col = await reactMessage.awaitReactions(filter, { time: 15000, max: 1 });
	if (!col.size) {
		message.channel.send("You did not react to the message so I ended this session.");
		return false;
	}
	return col.first().emoji.name;
};
const applicationAlert = async(client, text, channel = applicationChannel) => {
	const apps = await Applications.findAll({ where: {} });
	text = text.replace("[applicationCount]", apps.length);
	const embed =
		new DDEmbed(client)
			.setStyle("colorful")
			.setTitle("Application Alert")
			.setDescription(text)
			.setThumbnail("https://cdn.discordapp.com/attachments/491045091801300992/509907961272074270/news.png");
	if (await Applications.count({ where: {} }) !== 0) {
		embed.addField("LIST OF APPLICATIONS", empty);
		apps.map(app => {
			const i = apps.indexOf(app) + 1;
			const tag = client.users.get(app.id) ? client.users.get(app.id).tag : "Unknown User";
			embed.addField(`[${i}] ${tag}`, `Application Code: \`${app.code}\``);
		});
	}
	client.channels.get(channel).send(embed);
};
const updateWebsites = client => {
	console.log("[Discord] Updating websites...");
	post(`https://discordbots.org/api/bots/335637950044045314/stats`)
		.set("Authorization", discordbotsToken)
		.send({ server_count: client.guilds.size })
		.then(console.log("[Discord] Updated discordbots.org stats."))
		.catch(e => console.log("[Discord] ", e.body));
	post(`https://bots.discord.pw/api/bots/335637950044045314/stats`)
		.set("Authorization", discordpwToken)
		.send({ server_count: client.guilds.sizet })
		.then(console.log("[Discord] Updated bots.discord.pw stats."))
		.catch(e => console.log("[Discord] ", e.body));
	/* post(`https://bots.discordlist.net/api`)
		.set("Authorization", discordlistToken)
		.send({ server_count: client.guilds.size })
		.then(console.log("[Discord] Updated bots.discordlist.net stats."))
		.catch(e => console.log("[Discord] ", e.body));*/
	/* post(`https://listcord.com/api/bot/335637950044045314/guilds`)
		.set("Content-Type", "application/json")
		.set("token", listcordToken)
		.send({ guilds: client.guilds.size })
		.then(console.log("[Discord] Updated Listcord stats."))
		.catch(e => console.log("[Discord] ", e.body));*/
};

const checkOrders = client => {
	setInterval(async() => {
		const cookingOrders = await Orders.findAll({ where: { status: { [Op.lt]: 5 } } });
		cookingOrders.forEach(async order => {
			if (order.status < 1) {
				if (order.timeLeft < 1) {
					await order.update({ status: 6 });
					return client.users.get(order.user).send("Your order has expired, please try again");
				}

				await order.decrement("timeLeft", { by: 1 });
			} else if (order.status === 2) {
				if (order.cookTimeLeft < 1) {
					const user = client.users.get(order.user);
					const channel = client.channels.get(order.channel);
					const embed = new DDEmbed(client)
						.setStyle("white")
						.setTitle("An order has finished cooking!")
						.setDescription(`Ticket ${order.id} has completed cooking and is ready to be delivered!`)
						.addField(":computer: Ticket Information", `This ticket came from ${channel.guild.name} (${channel.guild.id}) in ${channel.name} (${channel.id}).`);
					await order.update({ status: 3 });
					await client.users.get(order.user).send("Your order has been cooked. It will be delivered in a few minutes");
					client.channels.get(deliveryChannel).send(client.users.get(order.claimer));
					return client.channels.get(deliveryChannel).send(embed);
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

const chunk = size => arr =>
	arr.reduceRight((acc, x, index) => {
		if ((index + 1) % size === 0) acc.unshift([]);
		acc[0].push(x);
		return acc;
	}, [[]]);

const isurl = str => {
	try {
		new URL(str); // eslint-disable-line no-new
		return true;
	} catch (err) {
		return false;
	}
};

module.exports = {
	generateID,
	status,
	generateTicket,
	timeout,
	calcUptime,
	autoDeliver,
	updateWebsites,
	messageAlert,
	checkOrders,
	isurl,
	chunk,
	applicationAlert,
	getInput,
	getReactions
};
