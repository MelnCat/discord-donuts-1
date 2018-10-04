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
      msg.author.send({embed: {
        title: 'Ticket Status',
        description: 'The status of this ticket.',
        fields: [{
          name: ':hash: Ticket ID',
          value: order.get('id')
        }, {
          name: 'Donut Description',
          value: order.get('description')
        }, {
          name: ':white_check_mark: Ticket Status',
          value: status(order.get('status'))
        }, {
          name: ':computer: Guild Information',
          value: `This ticket came from ${client.channels.get(orders.get('channel')).guild.name} (${client.channels.get(orders.get('channel')).guild.id}) in #${client.channels.get(orders.get('chanel')).name} (${orders.get('chanel')}).`
        }]
      }})
    }
  }
}
