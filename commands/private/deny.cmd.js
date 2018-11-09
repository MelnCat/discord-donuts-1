const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { isBotOwner, canCook } = require("../../permissions");
const { employeeRole } = require("../../auth");
const { Applications } = require("../../sequelize.js");
module.exports =
	new DDCommand()
		.setName("deny")
		.setDescription("Use this to deny applications.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			if (!args[0]) return message.channel.send("Please specify an application code.")
			if (!args[1]) return message.channel.send("Please specify a reason.")
			const reason = args.slice(1, args.length)
			const app = await Applications.findOne({where: {code: args[0]}});
			if (!app) return message.channel.send("I couldn't find an application with that code!")
			const member = client.guilds.get("294619824842080257").members.get(app.id)
			if (!member) return message.channel.send("The user who applied is not in the server!")
			if (canCook(member)) return message.channel.send("The user who applied is already a worker!")
			member.send("Your application has been denied for the following reason: `"+reason+"`")
			app.destroy({where: {}, truncate: {}})
			message.channel.send("I have successfully denied the application!");
		});
