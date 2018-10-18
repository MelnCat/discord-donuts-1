const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
	new DDCommand()
		.setName("uptime")
		.setDescription("The bot uptime.")
		.setPermissions(everyone)
		.setFunction(async(message, args, client) => {
			 function calcUptime() {
            let time = 0;
            let days = 0;
            let hrs = 0;
            let min = 0;
            let sec = 0;
            let temp = Math.floor(client.uptime / 1000);
            sec = temp % 60;
            temp = Math.floor(temp / 60);
            min = temp % 60;
            temp = Math.floor(temp / 60);
            hrs = temp % 24;
            temp = Math.floor(temp / 24);
            days = temp;
            let dayText = " Days, ";
            if (days == 1) {
              dayText = " Days, ";
            }
            const upText = "" + days + dayText + hrs + " hours" + ", " + min + " minutes, " + sec + " seconds ";
            return upText;
          }
        message.channel.send(calcUptime())
		});
