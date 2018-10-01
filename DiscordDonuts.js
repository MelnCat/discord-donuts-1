const { Collection } = require("discord.js");
const { createLogger, format, transports } = require("winston");
const { readdir } = require("fs-nextra");
const DailyRotateFile = require("winston-daily-rotate-file");

const Client = require("./Internals/Client.js");
const reload = global.reload = require("require-reload")(require);

const config = global.config = require("./Configuration/config.js");

// const { generateTicket, timeout } = require("./helpers");

const client = new Client({ disableEveryone: true, restTimeOffset: 0 });

const winston = global.winston = createLogger({
	transports: [
		new transports.Console({
			colorize: true,
		}),
		new DailyRotateFile({
			filename: "./Logs/Winston-Log-%DATE%.log",
			datePattern: "YYY-MM-DD-HH",
			zippedArchive: true,
			maxFiles: "14d",
			maxSize: "20m",
		}),
	],
	exitOnError: false,
	format: format.combine(
		format.colorize(),
		format.timestamp(),
		format.simple(),
	),
});

(async() => {
	await require("./Database/init")()
		.then(() => winston.info("[Database] Successfully connected to the database."))
		.catch(err => winston.error(`[Database] An error occured while initializing the database.\n${err}`));
	let events = await readdir("./Events");
	for (let e of events) {
		let name = e.replace(".js", "");
		client.on(name, (...args) => reload(`./Events/${e}`)(client, ...args));
	}
	let commands = await readdir("Commands");
	for (let c of commands) {
		if (!c.endsWith(".js")) return;
		const command = require(`./Commands/${c}`);
		client.commands.set(command.name, command);
	}
})();


// Orders.beforeCreate(order => {
// 	// All that i need to do here, is to run `generateTicket(client,order) and send it to the orders channel, no matter which shard
// 	client.api.channels("294620411721940993").messages.post({
// 		data: {
// 			embed: generateTicket(client, order),
// 		},
// 	});
// });

// Orders.afterCreate((order, options) => {
// 	timeout(20 * 60 * 1000).then(async() => {
// 		await order.update({ status: 6 });
// 		await client.users.get(order.get("user")).send("It has been 20 minutes, and therefore your order has been deleted");
// 	});
// });

// Orders.afterUpdate(async(order, options) => {
// 	if (!order.get("ticketMessageID")) return;
// 	const message = await client.channels.get(ticketChannel).fetchMessage(order.get("ticketMessageID"));
// 	message.edit(generateTicket(order));
// });

client.login(require("./Configuration/auth.js").discord.token).catch(() => {
	let interval = setInterval(() => {
		client.login(require("./Configuration/auth.js").discord.token)
			.then(() => {
				clearInterval(interval);
			})
			.catch(() => {
				winston.info("[Discord] Failed to connect. Retrying in 5 minutes...");
			});
	}, 300000);
});
client.on("disconnect", () => client.login(require("./Configuration/auth.js").discord.token));
