const { Blacklist } = require('../../sequelize')

const { isBotOwner } = require('../../permissions')

module.exports = {
  name: 'unblacklist',
  permissions: isBotOwner,
  description: 'Unblacklist a user or a guild, with a reason',
  async execute (message, args) {
    try {
      await Blacklist.destroy({ where: { id: args.shift() } })
    } catch (e) {
      console.log(e)
      return message.reply('Error')
    }
    message.reply('Blacklist removed')
  }
}
