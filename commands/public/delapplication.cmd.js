const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { channels: { applicationChannel } } = require("../../auth");
const { everyone } = require("../../permissions");
const { Applications } = require("../../sequelize");
const { applicationAlert } = require("../../helpers.js");
const stringSimilarity = require("string-similarity");
module.exports =
	new DDCommand()
		.setName("delapplication")
		.addAlias("delapp")
		.setDescription("Delete your application if you have one.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!await Applications.findById(message.author.id)) return message.channel.send("<:no:501906738224562177> You do not have an application.");
			const questions = client.questions.splice(0, client.questions.length - 1);
			const app = await Applications.findById(message.author.id);
			await app.destroy();
			message.channel.send("We've removed your application!");
			applicationAlert(client, `${message.author.tag} has cancelled their application. There are now [applicationCount] applications.`);
		});
