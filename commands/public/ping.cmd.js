const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("ping")
		.setDescription("Fetching timestamp values.")
		.setPermissions(everyone)
		.setFunction(async (message, args, client) => {
			const startTime = Date.now();
			const m = await message.channel.send("Fetching responses..");
			const endTime = Date.now();
			await m.edit(`Latency is \`${endTime - startTime}ms\`. API latency is \`${Math.round(client.ws.ping)}ms\`.`);
		});
