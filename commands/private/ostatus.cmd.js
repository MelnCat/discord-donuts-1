const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders } = require("../../sequelize");
const { status } = require("../../helpers");
const { canCook } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("ostatus")
		.setDescription("Lists info about a specific order.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			const order = await Orders.findOne({ where: { id: args.shift() } });

			if (!order) {
				const embed =
					new DDEmbed(client)
						.setStyle("white")
						.setTitle("Order Status")
						.setDescription("Couldn't find that order.")
						.setThumbnail("https://images.emojiterra.com/twitter/512px/274c.png");

				return message.channel.send(embed);
			} else {
				const embed =
					new DDEmbed("white")
						.setTitle("Ticket Status")
						.setDescription("The status of this ticket.")
						.addField(":hash: Ticket ID", order.get("id"))
						.addField("Donut Description", order.get("description"))
						.addField(":white_check_mark: Ticket Status", status(order.get("status")))
						.addField(":computer: Guild Information", `This ticket came from ${client.channels.get(order.get("channel")).guild.name} (${client.channels.get(order.get("channel")).guild.id}) in #${client.channels.get(order.get("channel")).name} (${order.get("channel")}).`);

				message.channel.send(embed);
			}
		});
