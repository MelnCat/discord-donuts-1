const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://a9fa3427c2bf4261991dfa47718ea1f8@sentry.io/1315760" });

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const Discord = require("discord.js");
const glob = require("glob");

const DDClient = require("./structures/DDClient.struct");

const { Orders, Blacklist, WorkerInfo, PrecookedDonuts, Op, Prefixes } = require("./sequelize");
const { token, prefix, channels: { ticketChannel, guildLogChannel, testChannel } } = require("./auth.json");
const { generateTicket, timeout, updateWebsites, messageAlert, checkOrders } = require("./helpers");

const DDEmbed = require("./structures/DDEmbed.struct");

const client = new DDClient({ shardCount: 2 });

Orders.beforeCreate(async order => {
	const orderMsg = await client.channels.get(ticketChannel).send(generateTicket(client, order));
	order.ticketMessageID = orderMsg.id;
});

Orders.afterUpdate(async(order, options) => {
	if (!order.ticketMessageID) return;

	if (order.status > 4) return client.channels.get(ticketChannel).messages.fetch(order.ticketMessageID);

	(await client.channels.get(ticketChannel).messages.fetch(order.ticketMessageID)).edit(generateTicket(client, order));
});

client.once("ready", async() => {
	console.log(`[Discord] Connected! (ID: ${client.user.id})`);
	updateWebsites(client);
	Orders.sync();
	Blacklist.sync();
	PrecookedDonuts.sync();
	Prefixes.sync();
	WorkerInfo.sync();
	// Activities
	const activitiesList = ["Cooking Donuts...", "Donuts!", "Cookin' Donuts", "d!order Donuts", "<3 Donuts", "with Donuts"];

	setInterval(async() => {
		let index = Math.floor((Math.random() * (activitiesList.length - 1)) + 1);
		client.user.setActivity(activitiesList[index]);

		if (await Orders.count({ where: { status: { [Op.lt]: 2 } } }) > 1) {
			messageAlert(client, "There are [orderCount] order(s) left to claim");
		}
	}, 300000);

	checkOrders(client);

	const { stdout: commit } = await exec("git log --oneline | head -1");

	messageAlert(client, `Bot restarted, current commit is \`\`\`git
${commit}\`\`\`
`, testChannel);
});

client.on("message", async message => {
	if (message.channel.type == "dm") return message.channel.send("Sorry! Commands only work in servers.");
	const gprefix = await Prefixes.findById(message.guild.id);
	let messagePrefix;
	let gprefixstr;
	if (!gprefix) {
		gprefixstr = prefix;
	} else {
		gprefixstr = gprefix.prefix;
	}
	const prefixList = [`<@${client.user.id}> `, gprefixstr, `${gprefixstr} `];
	if (!prefixList.some(x => message.content.startsWith(x)) || message.author.bot) return;
	prefixList.map(x => {
		if (message.content.startsWith(x)) {
			messagePrefix = x;
		}
	});
	if (await Blacklist.findById(message.author.id)) return message.channel.send("I apologize, but you've been blacklisted from this bot!");
	if (await Blacklist.findById(message.guild.id)) {
		await message.channel.send("I apologize, but your server has been blacklisted from Discord Donuts.");
		return message.guild.leave();
	}

	const args = message.content.slice(messagePrefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	if (!client.getCommand(command).getPermissions(message.member)) return message.reply("You do not have permission to run this command");

	try {
		await client.getCommand(command).runFunction(message, args, client);
	} catch (e) {
		console.log(e);
		message.reply(`An error occurred!\n\`\`\`\n${e.stack}\n\`\`\``);
	}
});

client.on("guildCreate", async guild => {
	if (await Blacklist.findById(guild.id)) {
		guild.owner.send("I apologize, but your server has been blacklisted from Discord Donuts.");
		return guild.leave();
	}

	const embed =
		new DDEmbed(client)
			.setStyle("colorful")
			.setTitle("New Guild")
			.setDescription("New Guild Joined!")
			.addField("Guild Name", `${guild.name} (${guild.id})`);

	client.channels.get(guildLogChannel).send(embed);
	updateWebsites(client);
});

client.on("guildDelete", guild => {
	const embed =
		new DDEmbed(client)
			.setStyle("colorful")
			.setTitle("Left Guild")
			.setDescription("Left a Guild!")
			.addField("Guild Name", `${guild.name} (${guild.id})`);

	client.channels.get(guildLogChannel).send(embed);
	updateWebsites(client);
});

client.on("disconnect", () => {
	console.error(`[Discord] Disconnected! Attempting to reconnect...`);
	process.exit();
});

client.on("error", err => {
	console.log(`[Discord] ${err}`);
});

client.login(token);
console.log("[Discord] Connecting...");
