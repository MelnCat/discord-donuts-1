const DDCommand = require("../../structures/DDCommand.struct");
const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("eotm")
		.setDescription("Checks the employee of the month!")
		.setPermissions(everyone)
		.setFunction((message, args, client) => {
			const eotm = client.guilds.get("294619824842080257").roles.get("493072413123149865").members.first().user;
			message.channel.send(`**${eotm.tag}** is currently the **Employee of the Month**!`);
		});
