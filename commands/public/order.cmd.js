const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Blacklist, Orders, Op } = require("../../sequelize");

const { generateID } = require("../../helpers");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("order")
		.setDescription("Order your donuts here.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!args) return;
			if (await Blacklist.findOne({ where: { [Op.or]: [{ id: message.author.id }, { id: message.guild.id }] } })) {
				const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Couldn't Place Your Order")
					.setDescription(`Your order couldn't be placed.`)
					.addField("Reason", "Either you or your guild have been blacklisted.")
					.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			}

			const generatedID = generateID(6); // Note that this is actually a 7 char id
			console.log(generatedID);

			try {
				await Orders.create({
					id: generatedID,
					user: message.author.id,
					description: args.join(" "),
					channel: message.channel.id,
					status: 0,
					claimer: null,
					url: null,
					ticketMessageID: null
				});
			} catch (e) {
				return message.reply(e);
			}
			const embed =
				new DDEmbed(client)
					.setStyle("white")
					.setTitle("Ticket Created")
					.setDescription(`:ticket: Ticket Placed! Your ticketID: \`${generatedID}\``)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3ab.png");

			return message.channel.send(embed);
		});
