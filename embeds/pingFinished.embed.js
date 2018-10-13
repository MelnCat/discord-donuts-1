const DDEmbed = require("../structures/DDEmbed.struct");

module.exports = (client, args) =>
	new DDEmbed(client)
		.setTitle("Ping")
		.setDescription("The bot ping.")
		.addField("Ping", `:ping_pong: Pong! Took \`${args[0]}ms\`!`)
		.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
