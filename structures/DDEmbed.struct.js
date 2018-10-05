const Discord = require("discord.js");

/**
 * Class representing a Discord Donuts embed.
 * This type of embed has the author, footer, timestamps and the random embed color as well
 *  @extends Discord.MessageEmbed
 */
class DDEmbed extends Discord.MessageEmbed {
	/**
   * Create a DDEmbed
   * @param { Discord.Client } client The bot client. Used for getting the bots username/avatar
   * @param { Discord.MessageEmbed | Discord.MessageEmbedOptions } [data] Any extra data, required by Discord.MessageEmbed
   */
	constructor(client, data) {
		if (!client) throw new TypeError("Please provide a valid client instance");

		super(data);

		this.client = client;

		this.setTimestamp(new Date());
	}

	setStyle(style) {
		if (style === "colorful") {
			this.setColor(Math.floor(Math.random() * 16777216));
			this.setFooter(this.client.user.username, this.client.user.avatarURL);
			this.setAuthor(this.client.user.username, this.client.user.avatarURL);
		} else if (style === "white") {
			this.setColor(0xFFFFFF);
		} else {
			throw new TypeError(`Unrecognised style: ${style}`);
		}
		return this;
	}
}

module.exports = DDEmbed;
