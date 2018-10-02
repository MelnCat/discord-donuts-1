const { Orders, Op } = require('../../sequelize')

const { canCook } = require('../../permissions')

module.exports = {
  name: 'delticket',
  permissions: canCook,
  description: 'Delete unworthy tickets, with a reason',
  async execute (message, args) {
    if (!args) return message.reply('Please enter an order id')
    const deletedOrdersCount = await Orders.update({ status: 6 }, { where: { id: args.shift(), status: { [Op.lt]: 5 } }, individualHooks: true })
    if (deletedOrdersCount[0] < 1) return message.reply('Couldn\'t find that order')
    message.reply('Order deleted')
  }
}
