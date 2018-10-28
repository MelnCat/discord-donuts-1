const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { token } = require("../../auth.json");
const { isBotOwner } = require("../../permissions");
const permissions = require("../../permissions");
const sequelize = require("../../sequelize");
const helpers = require("../../helpers");

module.exports =
	new DDCommand()
		.setName("eval")
		.setDescription("Runs JavaScript code.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			try {
				let toEval = args.join(" ");
				if (toEval.includes("token")) return message.channel.send("Nice try with our tokens there :wink:");
				if (!toEval) return message.channel.send(":x: Include some code? o_O");
				let com = await eval(`(async () => \{${toEval}\})()`); // eslint-disable-line no-eval
				if (typeof com !== "string") com = require("util").inspect(com, false, 1);
				const escapeRegex = input => {
					const matchOperators = /[|\\{}()[\]^$+*?.]/g;
					return input.replace(matchOperators, "\\$&");
				};
				const array = [
					escapeRegex(token),
				];
				let regex = new RegExp(array.join("|"), "g");
				com = com.replace(regex, "Censored");
				message.channel.send({
					embed: {
						title: "Evaluate Javascript Complete!",
						description: "Evaluation complete!",
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						thumbnail: {
							url: client.user.avatarURL,
						},
						fields: [{
							name: "**Input**",
							value: `\`\`\`js\n${toEval}\`\`\``,
						}, {
							name: "**Output**",
							value: `\`\`\`js\n${com}\`\`\``,
						}],
					},
				});
			} catch (e) {
				message.channel.send({
					embed: {
						title: "Code Error!",
						description: "There was a error in your code!",
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						thumbnail: {
							url: client.user.avatarURL,
						},
						fields: [{
							name: "**Error**",
							value: `\`\`\`js\n${e}\`\`\``,
						}],
					},
				});
			}
		});
