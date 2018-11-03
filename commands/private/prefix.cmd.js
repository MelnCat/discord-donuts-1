const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");
const { Prefixes } = require("../../sequelize");
const { canEditGuild, everyone } = require("../../permissions");
const { prefix } = require("../../auth");

module.exports =
	new DDCommand()
		.setName("prefix")
		.setDescription("Check or change the guild prefix.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			const gprefix = Prefixes.findOrCreate({ where: { id: message.guild.id }, defaults: { id: message.guild.id, prefix: prefix } })[0];
			let editing = false;
			if (canEditGuild(message.member) || args[0]) editing = true;
			if (editing) {
				const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle("Prefix changed!")
					.setDescription(`Changed this guild's prefix!`)
					.addField("Old Prefix", gprefix.prefix)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
				const gprefixnew = await gprefix.update({ prefix: args[0] });
				embed.addField("New Prefix", gprefixnew.prefix);
				message.channel.send(embed);
			} else {
				const embed =
					new DDEmbed(client)
						.setStyle("colorful")
						.setTitle("This guild's prefix")
						.setDescription(`${message.guild.name}'s prefix is ${gprefix.prefix}!`)
						.setThumbnail("https://images.emojiterra.com/twitter/512px/1f3d3.png");
				message.channel.send(embed);
			}
		});
