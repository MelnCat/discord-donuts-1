const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Blacklist, Orders, Op } = require("../../sequelize");

const { generateID, messageAlert } = require("../../helpers");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("order")
		.setDescription("Order your donuts here.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!args.length) return message.channel.send(":x: Please enter a description");

			const generatedID = generateID(6); // Note that this is actually a 7 char id
			console.log(generatedID);

			let description = args.join(" ").trim();
			if (!description.toLowerCase.endsWith("donut")) description += " donut";

			Orders.create({
				id: generatedID,
				user: message.author.id,
				description: description,
				channel: message.channel.id,
				status: 0,
				claimer: null,
				url: null,
				ticketMessageID: null
			}).catch(console.log);

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Ticket Created")
					.setDescription(`:ticket: Ticket Placed! Your ticketID: \`${generatedID}\``)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3ab.png");

			message.channel.send(embed);

			return messageAlert("An order has been placed, there are now [orderCount] order(s) to claim");
		});
