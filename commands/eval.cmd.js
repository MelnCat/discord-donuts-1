const { token } = require('../auth.json')

const { isBotOwner } = require('../helpers.js')

module.exports = {
  name: 'eval',
  permissions: isBotOwner,
  description: 'Runs a JS command',
  async execute (message) {
    try {
			let toEval = message.content.split(" ").slice(1).join(" ");
			if (toEval.includes('token')) return message.channel.send("Nice try with our tokens there :wink:")
            if (!toEval) return message.channel.send(":x: Include some code? o_O")
			let com = eval(toEval);
      if (typeof com !== "string") com = require("util").inspect(com, false, 1);
      const escapeRegex = input => {
        const matchOperators = /[|\\{}()[\]^$+*?.]/g;
        return input.replace(matchOperators, "\\$&");
      }
			const array = [
				escapeRegex(token)
			]
			let regex = new RegExp(array.join("|"), "g");
			com = com.replace(regex, "Censored");
          channel.send({
              embed: {
                color: embedColor,
                title: "Evaluate Javascript Complete!",
                description: "Evaluation complete!",
                author: {
                  name: bot.user.username,
                  icon_url: bot.user.avatarURL
                },
                thumbnail: {
                  url: bot.user.avatarURL
                },
                fields: [{
                  name: "**Input**",
                  value: "```js\n" + toEval + "```"
                }, {
                  name: "**Output**",
                  value: "```js\n" + com + "```"
                }]
              }
            })
          } catch (e) {
            channel.send({
              embed: {
                color: embedColor,
                title: "Code Error!",
                description: "There was a error in your code!",
                author: {
                  name: bot.user.username,
                  icon_url: bot.user.avatarURL
                },
                thumbnail: {
                  url: bot.user.avatarURL
                },
                fields: [{
                  name: "**Error**",
                  value: "```js\n" + e + "```"
                }]
              }
            })
          }
  }
}