const { Orders } = require('../sequelize')

const { isBotOwner } = require('../permissions')

module.exports = {
  name: 'clear',
  permissions: isBotOwner,
  description: 'Lists all available donuts',
  async execute (message) {
    const deletedOrders = await Orders.destroy({ where: {} })
    if (deletedOrders) return message.reply('All orders deleted')
    message.reply('An error occured')
  }
}
