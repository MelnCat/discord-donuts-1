const { Orders } = require('../sequelize')

const { canCook } = require('../helpers')

module.exports = {
  name: 'ostatus',
  permissions: canCook,
  description: 'Lists info about a specific order',
  async execute (message,args) {
    const order = await Orders.findOne({ where: { id: args.shift() } })
    if (!order) message.reply('Couldn\'t find that order')
    else {
      message.channel.send(`id: ${order.get('id')}
user: ${order.get('user')}
description: ${order.get('description')}
channel: ${order.get('channel')}
status: ${status(order.get('status'))}
claimer: ${order.get('claimer')}
url: ${order.get('url')}
ticketMessageID: ${order.get('ticketMessageID')}`, { code: true })
    }
  }
}