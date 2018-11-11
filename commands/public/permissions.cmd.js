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
			function pretty(t) {
				let h = t.toLowerCase().split("_").join(" ");
				return [...h].map((x,i) => !i ? x.toUpperCase() : x).join("");
			}
			const perm = Object.keys(Discord.Permissions.FLAGS);
			chunk(25)(perm).forEach(async(section, index, arr) => {
				const embed =
					new DDEmbed(client)
						.setStyle("colorful")
						.setTitle("Permissions")
						.setDescription("Your permissions.");
				section.map(p => {
					const lg = message.member.permissions.has(p) ? "<:yes:501906738119835649>" : "<:no:501906738224562177>";
					const txt = pretty(p);
					embed.addField(txt, lg, true);
				message.channel.send(embed);
				});
			});
			chunk(25)(Object.keys(botperm)).forEach(async(section, index, arr) => {
				const embed =
					new DDEmbed(client)
						.setStyle("colorful")
						.setTitle("Permissions")
						.setDescription("Your bot permissions.");
				Object.keys(section).map(bp => {
					const fun = section[bp];
					const lg = fun(message.member) ? "<:yes:501906738119835649>" : "<:no:501906738224562177>";
					const txt = pretty(bp.replace(/([A-Z])/g, " $1").toLowerCase());
					embed.addField(txt, lg, true);
				message.channel.send(embed);
				});
			});
		});
