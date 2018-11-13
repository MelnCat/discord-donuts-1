const DDCommand = require("../../structures/DDCommand.struct");

const { MessageEmbed } = require("discord.js");
const { Orders } = require("../../sequelize");
const { isBotAdmin } = require("../../permissions");
const { messageAlert } = require("../../helpers");
const { channels: { kitchenChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("forceunclaim")
		.addAlias("funclaim")
		.setDescription("Use this to force unclaim donut orders.")
		.setPermissions(isBotAdmin)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send("<:no:501906738224562177> **Invalid arguments provided. Please ensure that you've provided an ID to claim.**");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.channel.send("<:no:501906738224562177> **Invalid arguments provided. Please ensure that you've provided a valid ID.**");

			const order = await Orders.findById(args.shift());
			if (!order) return message.channel.send("<:no:501906738224562177> **There was an issue fetching that order, please try again.**");
			if (order.claimer === null || order.status !== 1) return message.channel.send(`<:no:501906738224562177> **Order \`${args[0]}\` is not claimed.**`);

			await order.update({ status: 0, claimer: null });

			const claimEmbed = new MessageEmbed()
				.setColor(0x36393E)
				.setDescription(`🎫 **Your order has been unclaimed forcefully.**`)
				.setFooter(message.author.tag, message.author.displayAvatarURL())
				.setTimestamp();
			await client.users.get(order.user).send(claimEmbed);

			const embed = new MessageEmbed()
				.setColor(0x36393E)
				.setDescription(`<:yes:501906738119835649> **Claim successful, please ensure that you provide what the user has requested.**`)
				.setFooter(message.author.tag, message.author.displayAvatarURL());
			await message.channel.send(embed);

			await messageAlert(client, "An order has just been forcefully unclaimed, there are now [orderCount] orders left");
		});

