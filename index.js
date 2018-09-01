const { ShardingManager } = require('discord.js')

const { token } = require('./auth.json')

const manager = new ShardingManager('./bot.js', { token: token })

process.on('unhandledException', e => console.error(e.stack))

manager.spawn()
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`))
