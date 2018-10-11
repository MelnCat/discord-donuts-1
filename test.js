const Discord = require("discord.js");
const tap = require("tap");

module.exports = client => {

	const testChannel = client.channels.get("491045091801300992")

	tap.type(client, Discord.Client, "the client is a valid client");

	tap.test("ping command", async() => {
		await testChannel.send("!ping")
		const message = await testChannel.awaitMessages(() => true, { max:1, time: 30000, errors: ["time"]})
	})

	tap.end();
};
