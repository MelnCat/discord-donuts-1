const { MessageEmbed } = require('discord.js')

const { Orders } = require('./sequelize')

const timeout = delay => new Promise(resolve => setTimeout(resolve, delay))

const generateID = length => {
  let pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890'
  let str = 0
  for (let i = 0; i < length; i++) {
    str += pos.charAt(Math.floor(Math.random() * pos.length))
  }
  return str
}

/* eslint-disable indent */

const status = code => {
  if (code === 0) return 'Not Cooked'
else if (code === 1) return 'Claimed'
else if (code === 2) return 'Cooking'
else if (code === 3) return 'Cooked'
else if (code === 4) return 'Delivered'
else if (code === 5) return 'Deleted'
else if (code === 6) return 'Expired'
else if (code === 7) return 'Cancelled'
else return code
}

/* eslint-enable indent */

const generateTicket = (client, order) => {
  const user = client.users.get(order.get('user'))
  const channel = client.channels.get(order.get('channel'))
  return new MessageEmbed()
    .setColor(3447003)
    .setAuthor(user.username, user.avatarURL)
    .setTitle('\u1F3AB New Ticket')
    .setDescription(`${user.username}#${user.discriminator} (${user.id}) would like a donut!`)
    .addField('Donut Description', order.get('description'))
    .addField(':hash: Ticket ID', order.get('id'))
    .addField(':computer: Guild Information', `This ticket came from ${channel.guild.name} (${channel.guild.id}) in ${channel.name} (${channel.id}).`)
    .addField(':white_check_mark: Ticket Status', status(order.get('status')))
}

const autoDeliver = async (client, id) => {
  const finalOrder = await Orders.findOne({ where: { id: id } })

  const channel = client.channels.get(finalOrder.get('channel'))
  const user = channel.guild.members.get(finalOrder.get('user'))
  const url = finalOrder.get('url')

  channel.send(`${user}, here's your order! I know you love this bot. In case you didn't know, upkeeping a bot takes money. You can help keep us operating and our gears running smooth by being a patron over at https://patreon.com/discorddonuts. If you want to provide feedback, please use d!feedback. If you want to leave a tip, use d!tip.
${url}`)
}

module.exports = {
  generateID,
  status,
  generateTicket,
  timeout,
  autoDeliver
}
