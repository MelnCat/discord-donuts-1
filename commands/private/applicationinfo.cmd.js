const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { isBotOwner, canCook } = require("../../permissions");
const { employeeRole } = require("../../auth");
const { Applications } = require("../../sequelize.js");
const { applicationAlert } = require("../../helpers.js");

module.exports =
	new DDCommand()
		.setName("applicationinfo")
		.addAliases("appinfo", "app-info")
		.setDescription("Checks the info of an application.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send("Please specify an application code.");
			const app = await Applications.findOne({ where: { code: args[0] } });
			if (!app) return message.channel.send("I couldn't find an application with that code!");
			const application = await JSON.parse(app.application)
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`${client.users.get(app.id).tag}'s Application'`)
					.setDescription(`Application code: \`${app.code}\``)
					.setThumbnail("https://cdn.discordapp.com/attachments/491045091801300992/509907961272074270/news.png");
			for (let question of client.questions) {
				let response = application[client.questions.indexOf(question)]
				if (question.length > 255) question = `${question.substr(0, 251)}...`;
				if (question.length > 255) response = `${response.substr(0, 251)}...`;
				embed.addField(question, response);
			}
			message.channel.send(embed)
		});
