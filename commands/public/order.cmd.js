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
				if (!args[0]) return message.channel.send("<:no:501906738224562177> **Please provide a description of your order.**");
				if (await Orders.count({ where: { user: message.author.id, status: { [Op.lt]: 4 } } })) return message.channel.send("<:no:501906738224562177> **Failed to create order; you already have an order created, please try again later.**");

				let generatedID;
				do generatedID = generateID(6);
				while (await Orders.findById(generatedID));

				let description = args.join(" ").trim();
				let reg = /\[.+\]/;
				let matched = description.match(reg);
				let selections = {};
				if (matched) {
					let m = matched[0];
					try {
						selections = JSON.parse(m.replace("[", "{").replace("]", "}").replace(/[a-zA-Z]/g, n => `"${n}"`);
					} catch (err) {
						console.log(err);
					}
				}
				if (description.length > 40) return message.channel.send("<:no:501906738224562177> **Your donut description cannot exceed a character count of 40, please try again.**");
				if (!description.toLowerCase().includes("donut")) description += " donut";
				if (selections.oid) {
					generatedID = String(selections.oid);
				}
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

				await message.channel.send(`<:yes:501906738119835649> **Successfully placed your order for \`${description}\`. Your ticket ID is \`${generatedID}\`, please wait patiently for your order to be processed.**`);

				messageAlert(client, "An order has been placed, there are now [orderCount] order(s) to claim");
			});
