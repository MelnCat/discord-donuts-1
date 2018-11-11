const DDCommand = require("../../structures/DDCommand.struct");

const { MessageEmbed } = require("discord.js");
const { Orders } = require("../../sequelize");
const { canCook } = require("../../permissions");
const { messageAlert } = require("../../helpers");
const { channels: { kitchenChannel } } = require("../../auth.json");

module.exports =
	new DDCommand()
		.setName("claim")
		.setDescription("Use this to claim donut orders.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			if (message.channel.id !== kitchenChannel) return message.channel.send("<:no:501906738224562177> **You may only utilize this command in the kitchen.**");

			if (!args[0]) return message.channel.send("<:no:501906738224562177> **Invalid arguments provided. Please ensure that you've provided an ID to claim.**");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.channel.send("<:no:501906738224562177> **Invalid arguments provided. Please ensure that you've provided a valid ID.**");

			const order = await Orders.findById(args.shift());
			if (!order) return message.channel.send("<:no:501906738224562177> **There was an issue fetching that order, please try again.**");
			if (order.claimer != null) return message.channel.send(`<:no:501906738224562177> **Order \`${args[0]}\` has already been claimed.**`);

			await order.update({ status: 1, claimer: message.author.id });

			const claimEmbed = new MessageEmbed().setColor(0x36393E).setDescription(`🎫 **Your order has been claimed by \`${message.author.tag}\`!\nPlease wait while they process your order.**`)
.setFooter(message.author.tag, message.author.displayAvatarURL())
.setTimestamp();
			await client.users.get(order.user).send(claimEmbed).catch(e => { });

			const embed = new MessageEmbed().setColor(0x36393E).setDescription(`<:yes:501906738119835649> **Order \`${args[0]}\` has been claimed by ${message.author}!**`);
			await message.channel.send(embed);

			await messageAlert(client, "An order has just been claimed, there are now [orderCount] orders left");
		});

