const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { canCook } = require("../../permissions");
const { WorkerInfo } = require("../../sequelize");

module.exports =
	new DDCommand()
		.setName("workerinfo")
		.setDescription("Checks a user's or your own stats..")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
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
			message.channel.send(`${canCook(member)?"Yes":"No"} and ${WorkerInfo.findById(user.id)?"yes":"no"}`)
			if (!member) message.channel.send("The person seems to not be in this server.");
			if (!canCook(member) && !WorkerInfo.findById(user.id)) return message.channel.send("They are not a worker!");
			const workerraw = await WorkerInfo.findOrCreate({ where: { id: user.id }, defaults: { id: user.id, cooks: 0, delivers: 0, lastCook: 0, lastDeliver: 0 } });
			const worker = workerraw[0];
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`${user.tag}'s worker stats`)
					.setDescription(`The stats of ${user.tag}.`)
					.addField("Cooks", `${worker.cooks} cooks`)
					.addField("Delivers", `${worker.delivers} cooks`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
			message.channel.send(embed);
		});
