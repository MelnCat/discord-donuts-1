const { Orders } = require('../../sequelize');

const { canCook } = require('../../permissions');

module.exports = {
  name: 'deliver',
  permissions: canCook,
  description: 'Use this to deliver cooked donuts',
  async execute(message, args, client) {
    const order = await Orders.findOne({ where: { id: args.shift() } });
    if (!order) return message.reply('Couldn\'t find that order!');

    await order.update({ status: 4 });

    message.reply('Order information send to the DMs!');

    const invite = client.channels.get(order.get('channel')).createInvite({
      maxAge: 86400,
      maxUses: 1,
      unique: true,
    });

    msg.author.send({ embed: {
      title: 'Delivery Info',
      description: 'The ticket has been deleted, it\'s all on you now.',
      fields: [{
        name: 'Ticket Description',
        value: order.get('description'),
      }, {
        name: 'User Information',
        value: `${client.users.get(order.get('user').name)} (${order.get('user')}) in #${client.channels.get(order.get('channel').name)} (${order.get('channel')}).`,
      }, {
        name: 'Cook\' Image',
        value: order.get('url'),
      }],
    } } + invite.url);
  },
};
