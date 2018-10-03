const { Orders } = require('../../sequelize')

const { status } = require('../../helpers')

const { canCook } = require('../../permissions')

module.exports = {
  name: 'ostatus',
  permissions: canCook,
  description: 'Lists info about a specific order.',
  async execute (message, args, client) {
    const order = await Orders.findOne({ where: { id: args.shift() } })
    if (!order) message.reply('Couldn\'t find that order.')
    else {
      message.channel.send(`
        id: ${order.get('id')}
        user: ${client.users.get(order.get('user')).username} (${order.get('user')}).
        description: ${order.get('description')}
        channel: ${client.channels.get(order.get('channel')).name} (${order.get('channel')})
        status: ${status(order.get('status'))}
        claimer: ${client.users.get(order.get('claimer')).username} (${order.get('claimer')})
        url: ${order.get('url')}
        ticketMessageID: ${order.get('ticketMessageID')}`, { code: true }
      )
    }
  }
}
