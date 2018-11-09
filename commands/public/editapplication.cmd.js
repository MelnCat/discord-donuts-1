const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { channels: { applicationChannel } } = require("../../auth");
const { everyone } = require("../../permissions");
const { Applications } = require("../../sequelize");
const stringSimilarity = require("string-similarity");
module.exports =
	new DDCommand()
		.setName("editapplication")
		.addAliases("editapply", "edit-apply", "edit-application")
		.setDescription("Edit your application if you have one.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			async function getReactions(display, reactions) {
				const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === message.author.id;
				let msg = await message.channel.send(display);
				for (const r of reactions) {
					msg.react(r);
				}
				const col = await msg.awaitReactions(filter, { time: 15000, max: 1 });
				if (!col.size) return message.channel.send("You did not react to the message so I ended this session.");
				return reactions.indexOf(col.first().emoji.name);
			}
			if (!await Applications.findById(message.author.id)) return message.channel.send("<:no:501906738224562177> You do not have an application.");
			let qu = client.questions;
			qu.splice(0, client.questions.length - 1);
			const questions = qu;
			const app = await Applications.findById(message.author.id);
			if (!args[0]) return message.channel.send("Please specify which value you want to change. Example: `d!editapply 5 15`");
			if (!args[1]) return message.channel.send("Please specify what you want to change the value into. Example: `d!editapply 5 15`");
			const content = args.join(" ");
			const apparray = JSON.parse(app.application);
			const change = questions[Number(content)]
			if (!change) return message.channel.send("Please specify a valid number!")
			const index = questions.indexOf(change);
			const sel = await getReactions(`Do you want to change "${change}" to "${content}"?`, ["❌", "✅"]);
			if (sel === 0) return message.channel.send("Ok, I cancelled this session!");
			let updated = apparray;
			updated[index] = content;
			app.update({ application: JSON.stringify(updated) });
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`Changed Application for ${message.author.tag}!`)
					.setThumbnail("https://cdn.discordapp.com/attachments/491045091801300992/509907961272074270/news.png")
					.setDescription("They have edited their application.")
					.addField(change, content);
			await client.channels.get(applicationChannel).send(embed);
			message.channel.send(`You have changed question "${change}"'s answer to "${content}"!`);
		});
