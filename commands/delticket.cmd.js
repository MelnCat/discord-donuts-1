const { Orders, Op } = require('../sequelize')

const { canCook } = require('../helpers')

module.exports = {
  name: 'delticket',
  permissions: canCook,
  description: 'Delete unworthy tickets, with a reason',
  async execute (message,args) {
    const deletedOrdersCount = await Orders.update({ status: 6 }, { where: { id: args.shift(), status: { [Op.lt]: 5 } }, individualHooks: true })
    if (!deletedOrdersCount) message.reply('Couldn\'t find that order')
    else message.reply('Order deleted')
  }
}