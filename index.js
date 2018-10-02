const { ShardingManager } = require('discord.js')

const { token } = require('./auth.json')

const manager = new ShardingManager('./bot.js', { token: token, totalShards: 2 })

manager.respawn = false

manager.spawn()

// TODO: Find out why this doesn't work
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`))

manager.on('message', console.log)
