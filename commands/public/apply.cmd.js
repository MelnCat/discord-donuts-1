const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { channels: { applicationChannel } } = require("../../auth");
const { everyone } = require("../../permissions");
const { Applications } = require("../../sequelize");

module.exports =
	new DDCommand()
		.setName("apply")
		.setDescription("Apply for employee!")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			if (await Applications.findById(message.author.id)) return message.channel.send("<:no:501906738224562177> You already have an application.");
			const lastmsg = "Last but not least, please ensure that you comply with the following:\nDo you recognize by penalty of perjury that all information presented is 100% genuine, that you stated the truth and nothing but the truth, and that we can hold you accountable? Do you acknowledge that you have read your obligations accurately and thoroughly and will be held responsible for your efforts, notwithstanding of the situation and/or outcome? Do you agree already be following, to continue following and sustain Discord's Terms of Service (found at https://discordapp.com/tos), Community Guidelines (found at https://discordapp.com/guidelines) and the rules of our Discord server; and are amenable to face the consequences to the highest extent if you are affirmed guilty of unlawful actions, per these three documents?";
			message.channel.send("Thank you for applying! We will take you through a couple of questions. Please read through the whole application clearly and answer all the questions to the best of your ability. Take your time.\n**PREREQUISITES**:\nPlease be in our server, not be banned from our server and/or blacklisted from the bot in any previous or current occasion (with exceptions) and have a clean/somewhat clean record.");
			async function getMessage(display) {
				message.channel.send(display);
				let v = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 17000 });
				if (v.size === 0) return message.channel.send("You did not provide me with a value so I cancelled this session.");
				let vv = v.first().content;
				return vv;
			}
			let q = 0;
			function questionize(text) {
				q++;
				return `**Question ${q}**: ${text}`;
			}
			const questionsold = ["What languages can you speak?", "Why should we hire you as an employee?", "What other experiences do you have in this type of field?", "How could you potentially benefit Discord Donuts?", "How old are you?", "What time zone are you located in?", "Approximately how many hours *could* you contribute to this position?", lastmsg];
			const responses = [];
			client.questions = questionsold.map(qu => questionize(qu));
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`New Application from ${message.author.tag}!`)
					.setThumbnail("https://cdn.discordapp.com/attachments/491045091801300992/509907961272074270/news.png");
			for (let question of client.questions) {
				let resp = await getMessage(question);
				responses.push(resp);
				if (question.length > 255) question = `${question.substr(0, 251)}...`;
				if (question.length > 255) resp = `${resp.substr(0, 251)}...`;
				embed.addField(question, resp);
			}
			message.channel.send("This is the end your our application. Thanks for applying! We will get back to you ASAP! Remember to join our server, our invite is https://discord.gg/WJgamKm. Remember that improper or incomplete applications will not be considered, and asking when you're gonna be hired or inquiring about your application in any way before three days of your submission date is against our rules!");
			message.author.send(`Thank you for applying. Your application code is \`${message.author.id.substr(8, 15)}\`. Thank you!`);
			await Applications.create({ id: message.author.id, application: JSON.stringify(responses), code: message.author.id.substr(8, 15) });
			await client.channels.get(applicationChannel).send(embed);
		});
