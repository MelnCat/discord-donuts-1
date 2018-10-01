module.exports = async(client, msg) => {
	if (msg.author.bot) return;

	const prefix = msg.content.startsWith(client.user) ? `${client.user} ` : config.prefix;

	const cmd = msg.content.split(" ")[0].trim().toLowerCase().replace(prefix, "");
	const suffix = msg.content.split(" ").splice(1).join(" ")
		.trim();

	if (!msg.content.startsWith(prefix) || !client.commands.has(cmd)) return;

	try {
		await client.commands.get(cmd).execute(client, msg, suffix);
	} catch (err) {
		msg.channel.send({
			embed: {
				color: 0xFF0000,
				title: ":x: Error!",
				description: `An unexpected error has occured.\n\`\`\`js\n${err.stack}\`\`\``,
				footer: {
					text: "Please contact a maintainer.",
				},
			},
		});
	}
};
