const { Orders, Op } = require('../../sequelize')

const { canCook } = require('../../helpers')

module.exports = {
  name: 'list',
  permissions: canCook,
  description: 'Lists all available donuts',
  async execute (message) {
    const ordersList = await Orders.findAll({ where: { status: { [Op.lt]: 5 } }, attributes: ['id'] })
    const ordersFormatted = ordersList.map(t => `\n\`${t.id}\``).join('') || ''
    message.channel.send(`Current orders: ${ordersFormatted}`)
  }
}
