const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./DiscordDonuts.js", {
	token: require("./auth.json").token,
	totalShards: require("./Configuration/config.js").totalShards,
	respawn: true,
});

manager.spawn();

manager.on("shardCreate", shard => console.log(`[Sharder] Launched shard ${shard.id}`));
