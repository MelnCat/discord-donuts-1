const Discord = require("discord.js");

const glob = require("glob");

const { Orders, Blacklist, WorkerInfo } = require("./sequelize");

const { token, ticketChannel, prefix } = require("./auth.json");

const { generateTicket, timeout } = require("./helpers");

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = glob.sync("./commands/**/*.cmd.js");

console.log(commandFiles);

commandFiles.forEach(file => {
	const command = require(file);

	client.commands.set(command.name, command);
});

// TODO: Find a way to get hooks to only load once

Orders.beforeCreate(async order => {
	if (order.get("ticketMessageID")) return;

	const orderMsg = await client.api.channels(ticketChannel).messages.post({
		data: {
			embed: generateTicket(client, order)._apiTransform(),
		},
	});
	order.ticketMessageID = orderMsg.id;
});

Orders.afterCreate((order, options) => {
	timeout(20 * 60 * 1000).then(async() => {
		await order.update({ status: 6 });
		await client.users.get(order.get("user")).send("It has been 20 minutes, and therefore your order has been deleted.");
	});
});

Orders.afterUpdate(async(order, options) => {
	if (!order.get("ticketMessageID")) return;
	// const message = await client.channels.get(ticketChannel).messages.fetch(order.get('ticketMessageID'))
	// message.edit(generateTicket(order))

	// FIXME: This might be running for every shard
	client.api.channels(ticketChannel).messages(order.get("ticketMessageID")).patch({
		data: {
			embed: generateTicket(client, order)._apiTransform(),
		},
	});
});

client.once("ready", () => {
	console.log("Ready!");
	Orders.sync();
	Blacklist.sync();
	WorkerInfo.sync();
});

client.on("message", async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args, client);
	} catch (e) {
		console.log(e);
		message.reply("An error occured!");
	}
});

client.login(token);

process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);
