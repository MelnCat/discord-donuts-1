const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { canCook } = require("../../permissions");
const { WorkerInfo, MonthlyInfo } = require("../../sequelize");

module.exports =
	new DDCommand()
		.setName("workerinfo")
		.setDescription("Checks a user's or your own stats..")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			let data = WorkerInfo;
			if (args[0] && args[0].includes("month")) {
			data = MonthlyInfo;
			args.shift();
			}
			let user;
			if (!args[0]) {
				user = message.author;
			} else if (message.mentions.users.first()) {
				user = message.mentions.users.first();
			} else if (isNaN(args[0])) {
				return message.channel.send(`"${args[0]}" is not an id!`);
			} else if (!client.users.get(args[0])) {
				user = { id: args[0], tag: "Unknown User", artificial: true };
			} else {
				user = client.users.get(args[0]);
			}
			if (!user) return message.channel.send(`Something went wrong.`);
			const member = client.guilds.get("294619824842080257").members.get(user.id);
			if (!member) message.channel.send("The person seems to not be in this server.");
			if (!await data.findById(user.id) && !canCook(member)) return message.channel.send("They are not a worker!");
			const workerraw = await data.findOrCreate({ where: { id: user.id }, defaults: { id: user.id, cooks: 0, delivers: 0, lastCook: 0, lastDeliver: 0, username: user.tag } });
			const worker = workerraw[0];
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`${user.tag}'s worker stats`)
					.setDescription(`The stats of ${user.tag}.`)
					.addField("Cooks", `${worker.cooks} cook${worker.cooks !== 1 ? "s" : ""}`)
					.addField("Delivers", `${worker.delivers} deliver${worker.delivers !== 1 ? "s" : ""}`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");
			message.channel.send(embed);
		});
