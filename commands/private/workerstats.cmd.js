const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { canCook } = require("../../permissions");
const { WorkerInfo, MonthlyInfo } = require("../../sequelize");

module.exports =
	new DDCommand()
		.setName("workerinfo")
		.setDescription("Checks the global worker stats. NOTE: This is NOT workerinfo. It display things such as TOTAL COOKS, etc.")
		.setPermissions(canCook)
		.setFunction(async(message, args, client) => {
			let data = WorkerInfo;
			let isMonthly = false;
			if (args[0] && args[0].includes("month")) {
				data = MonthlyInfo;
				args.shift();
				isMonthly = true;
			}
			const sumc = await data.sum("cooks")
			const sumd = await data.sum("delivers")
			const sum = sumc + sumd
			const embed =
				new DDEmbed(client)
					.setStyle("colorful")
					.setTitle(`The Global ${isMonthly?"Monthly ":""}Worker Stats`)
					.setDescription(`The global stats.`)
					.addField("Total Cooks", `${worker.cooks} cook${worker.cooks !== 1 ? "s" : ""}`)
					.addField("Average Cooks", `${worker.delivers} deliver${worker.delivers !== 1 ? "s" : ""}`)
					.setThumbnail("https://images.emojiterra.com/twitter/512px/1f4ca.png");
			message.channel.send(embed);
		});
