const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, Op } = require("../../sequelize");

const { generateID, messageAlert } = require("../../helpers");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("order")
		.setDescription("Order your donuts here.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send("Please provide a description");

			if (await Orders.count({ where: { user: message.author.id, status: { [Op.lt]: 4 } } })) return message.reply("You already have an order");

			let generatedID;
			do generatedID = generateID(6);
			while (await Orders.findById(generatedID));

			let description = args.join(" ").trim();
			if (!description.toLowerCase().endsWith("donut")) description += " donut";

			await Orders.create({
				id: generatedID,
				user: message.author.id,
				description: description,
				channel: message.channel.id,
				status: 0,
				claimer: null,
				url: null,
				ticketMessageID: null,
				timeLeft: 20,
				cookTimeLeft: 3,
				deliveryTimeLeft: 3
			});

			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Ticket Created")
					.setDescription(`:ticket: Ticket Placed! Your ticketID: \`${generatedID}\``)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3ab.png");

			await message.channel.send(embed);

			messageAlert(client, "An order has been placed, there are now [orderCount] order(s) to claim");
		});
