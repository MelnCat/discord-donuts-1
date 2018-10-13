const Discord = require("discord.js");
const tap = require("tap");
const TSR = require("tap-mocha-reporter");

module.exports = client => {
	tap.pipe(TSR("spec"));

	const testChannel = client.channels.get("491045091801300992");

	tap.type(client, Discord.Client, "the client is a valid client");

	tap.test("ping command", async test => {
		await testChannel.send("!ping");
		const messageCollection = await testChannel.awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] });

		test.equal(messageCollection.first().embeds[0].title, "Ping", "the name of the embed should be ping");
	});

	tap.end();
};
