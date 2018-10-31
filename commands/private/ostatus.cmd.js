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
			if (!args[0]) return message.reply("Please provide an id");
			if (!args[0].match(/^0[a-zA-Z0-9]{6}$/)) return message.reply("That doesn't look like a valid id");

			const order = await Orders.findById(args[0]);

			if (!order) return message.reply("That order doesn't exist");

			const embed =
				new DDEmbed("white")
					.setTitle("Ticket Status")
					.setDescription("The status of this ticket.")
					.addField(":ash: Ticket ID", order.id)
					.addField("Donut Description", order.description)
					.addField(":white_check_mark: Ticket Status", status(order.status))
					.addField(":computer: Guild Information", `This ticket came from ${client.channels.get(order.channel).guild.name} (${client.channels.get(order.channel).guild.id}) in #${client.channels.get(order.channel).name} (${order.channel}).`);

			message.channel.send(embed);
		});
