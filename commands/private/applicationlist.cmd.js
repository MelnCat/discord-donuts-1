const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { isBotOwner, canCook } = require("../../permissions");
const { employeeRole } = require("../../auth");
const { Applications } = require("../../sequelize.js");
const { applicationAlert } = require("../../helpers.js");
const empty = "​";
module.exports =
	new DDCommand()
		.setName("applicationlist")
		.addAliases("applist", "app-list")
		.setDescription("Lists all the current applications.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			const apps = await Applications.findAll({ where: {} });
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Application List'`)
					.setDescription(`A list of all the applications.`)
					.setThumbnail("https://cdn.discordapp.com/attachments/491045091801300992/509907961272074270/news.png");
			if (await Applications.count({ where: {} }) !== 0) {
				embed.addField("LIST OF APPLICATIONS", empty);
				apps.map(app => {
					const i = apps.indexOf(app) + 1;
					const tag = client.users.get(app.id) ? client.users.get(app.id).tag : "Unknown User";
					embed.addField(`[${i}] ${tag}`, `Application Code: \`${app.code}\``);
				});
			} else {
				embed.addField("No applications yet!", empty);
			}
			message.channel.send(embed)
		});
