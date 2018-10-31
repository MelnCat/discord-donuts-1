const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders } = require("../../sequelize");
const { status } = require("../../helpers");
const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("status")
		.setDescription("Lists info about your current order.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const order = await Orders.findOne({ where: { user: message.author.id } });

			if (!order) return message.reply("You do not currently have a donut");

			const embed =
				new DDEmbed("white")
					.setTitle("Ticket Status")
					.setDescription("The status of this ticket.")
					.addField(":ash: Ticket ID", order.id)
					.addField("Donut Description", order.decription)
					.addField(":white_check_mark: Ticket Status", status(order.status))
					.addField(":computer: Guild Information", `This ticket came from ${client.channels.get(order.channel).guild.name} (${client.channels.get(order.channel).guild.id}) in #${client.channels.get(order.channel).name} (${order.chanel}).`);

			message.channel.send(embed);
		});
