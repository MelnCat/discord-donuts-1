const Discord = require("discord.js");

const DDCommand = require("../../structures/DDCommand.struct");
const DDEmbed = require("../../structures/DDEmbed.struct");

const { everyone } = require("../../permissions");
const botperm = require("../../permissions");
module.exports =
	new DDCommand()
		.setName("permissions")
		.addAliases("perms", "perm")
		.setDescription("Checks your own permissions.")
		.setPermissions(everyone)
		.setFunction((message, args, client) => {
			const perm = Object.keys(Discord.Permissions.FLAGS);
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Permissions")
					.setDescription("Your permissions.");
			perm.map(p => {
				const lg = message.member.permissions.has(p) ? "✅" : "❎";
				const txt = p.replace("_", "").charAt(0).toUpperCase() + p.replace("_", "").substr(1);
				embed.addField(txt, lg, true);
			});
			Object.keys(botperm).map(bp => {
				const fun = botperm(bp);
				const lg = fun(message.member) ? "✅" : "❎";
				const txt = bp.replace(/([A-Z])/g, " $1").toLowerCase().charAt(0)
.toUpperCase() + bp.replace(/([A-Z])/g, " $1").toLowerCase().substr(1);
				embed.addField(txt, lg, true);
			});
			message.channel.send(embed);
		});
