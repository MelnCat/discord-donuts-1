const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { channels: { applicationChannel } } = require("../../auth");
const { everyone } = require("../../permissions");
const { Applications } = require("../../sequelize");
const stringSimilarity = require("string-similarity");
module.exports =
	new DDCommand()
		.setName("delapplication")
		.addAliases("delapply", "del-apply", "del-application", "delete-apply", "deleteapply")
		.setDescription("Delete your application if you have one.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (!await Applications.findById(message.author.id)) return message.channel.send("<:no:501906738224562177> You do not have an application.");
            const questions = client.questions.splice(0, client.questions.length - 1);
            const app = await Applications.findById(message.author.id);
            await app.destroy();
            const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Deleted Application from ${message.author.tag}!`)
					.setThumbnail("https://cdn.discordapp.com/attachments/491045091801300992/509907961272074270/news.png")
					.setDescription("They have deleted their application.");
			message.channel.send("This is the end your our application. Thanks for applying! We will get back to you ASAP! Remember to join our server, our invite is https://discord.gg/WJgamKm. Remember that improper or incomplete applications will not be considered, and asking when you're gonna be hired or inquiring about your application in any way before three days of your submission date is against our rules!");
			await Applications.create({ id: message.author.id, application: JSON.stringify(responses) });
			await client.channels.get(applicationChannel).send(embed);
		});
