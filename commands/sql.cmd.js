const { isBotOwner } = require('../helpers')

module.exports = {
  name: 'sql',
  permissions: isBotOwner,
  description: 'Runs an sql command',
  async execute (message,args) {
    try {
      const result = await sequelize.query(args.join(' '))
      await message.channel.send(JSON.stringify(result[0]))
    } catch (e) {
      await message.channel.send(e.message)
    }
  }
}