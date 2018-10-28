const DDCommand = require("../../structures/DDCommand.struct");
const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("eotm")
		.setDescription("eotm")
		.setPermissions(everyone)
		.setFunction((client, args, message) => {
			const eotm = client.guilds.get("294619824842080257").roles.get("493072413123149865").members.first().user;
			message.channel.send(`**${eotm.tag}** is currently the **Employee of the Month**!`);
		});
