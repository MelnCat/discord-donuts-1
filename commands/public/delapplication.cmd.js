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
			message.channel.send("We've removed your application!");
			await client.channels.get(applicationChannel).send(embed);
		});
