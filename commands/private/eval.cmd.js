const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { token } = require("../../auth.json");
const { isBotOwner } = require("../../permissions");
const sequelize = require("./sequelize");
const auth = require("./auth.json");
const helpers = require("./helpers");
delete auth.token;
module.exports =
	new DDCommand()
		.setName("eval")
		.setDescription("Runs JavaScript code.")
		.setPermissions(isBotOwner)
		.setFunction(async(message, args, client) => {
			try {
				let toEval = args.join(" ");
				if (toEval.includes("token")) return message.channel.send("<:no:501906738224562177> **You are not authorized to execute this code.**");
				if (!toEval) return message.channel.send("<:no:501906738224562177> **Please ensure that you've supplied proper arguments.**");
				let com = await eval(`(async () => \{${toEval}\})()`); // eslint-disable-line no-eval, no-useless-escape
				if (typeof com !== "string") com = require("util").inspect(com, false, 1);
				const escapeRegex = input => {
					const matchOperators = /[|\\{}()[\]^$+*?.]/g;
					return input.replace(matchOperators, "\\$&");
				};
				const array = [
					escapeRegex(token),
				];
				let isOutHigh = com.length > 1987;
				let regex = new RegExp(array.join("|"), "g");
				com = com.replace(regex, "Censored");
				message.channel.send(`\`\`\`js\n${com.substr(0, 1987)}${isOutHigh?"...":""}\`\`\``);
			} catch (e) {
				let isErrHigh = e.stack.length > 1987;
				message.channel.send(`\`\`\`js\n${e.stack.substr(0, 1987)}${isErrHigh?"...":""}\`\`\``);
			}
		});
