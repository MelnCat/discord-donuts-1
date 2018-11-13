const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { isBotAdmin, canCook } = require("../../permissions");
const { employeeRole } = require("../../auth");
const { Applications } = require("../../sequelize.js");
const { applicationAlert } = require("../../helpers.js");
module.exports =
	new DDCommand()
		.setName("accept")
		.setDescription("Use this to accept applications.")
		.setPermissions(isBotAdmin)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send("Please specify an application code.");
			const app = await Applications.findOne({ where: { code: args[0] } });
			if (!app) return message.channel.send("I couldn't find an application with that code!");
			const member = client.guilds.get("294619824842080257").members.get(app.id);
			if (!member) return message.channel.send("The user who applied is not in the server!");
			if (canCook(client, member)) return message.channel.send("The user who applied is already a worker!");
			member.roles.add(employeeRole);
			member.send("Great news! Your application has been accepted. You are now a worker!");
			app.destroy({ where: {}, truncate: {} });
			message.channel.send("I have successfully accepted the application!");
			applicationAlert(client, `${message.author.tag} has accepted an application. There are now [applicationCount] applications.`);
		});
