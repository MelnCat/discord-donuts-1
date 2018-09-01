const Discord = require('discord.js')
const Sequelize = require('sequelize')

const { token, employeeRole, kitchenChannel } = require('./auth.json')

const client = new Discord.Client()
const prefix = '!'

const Op = Sequelize.Op

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  // SQLite only
  storage: 'database.sqlite'})

const Orders = sequelize.define('orders', {
  id: {
    type: Sequelize.TEXT,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  user: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  channel: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  claimer: Sequelize.TEXT,
  url: {
    type: Sequelize.TEXT,
    validate: {
      isUrl: true
    }
  }
})

/* eslint-disable indent */

const status = code => {
       if (code === 0) return 'Not cooked'
  else if (code === 1) return 'Claimed'
  else if (code === 2) return 'Cooking'
  else if (code === 3) return 'Cooked'
  else return code
}

/* eslint-enable indent */

const timeout = delay => new Promise(resolve => setTimeout(resolve, delay))

const canCook = member => member.roles.has(employeeRole)

client.once('ready', () => {
  console.log('ready')
  Orders.sync()
})

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if (command === 'order') {
    const order = await Orders.create({
      id: generateID(6),
      user: message.author.id,
      description: args.join(' '),
      channel: message.channel.id,
      status: 0,
      claimer: null,
      url: null
    })
    console.log(order)
    message.reply(`Your order has been created: \`${order.get('id')}\``)
  } else if (command === 'list') {
    const ordersList = await Orders.findAll({ attributes: ['id'] })
    const ordersFormatted = ordersList.map(t => `\n\`${t.id}\``).join('') || ''
    message.channel.send(`Current orders: ${ordersFormatted}`)
  } else if (command === 'ostatus') {
    const order = await Orders.findOne({ where: { id: args.shift() } })
    if (!order) message.reply('Couldn\'t find that order')
    else {
      message.channel.send(`id: ${order.get('id')}
user: ${order.get('user')}
description: ${order.get('description')}
channel: ${order.get('channel')}
status: ${status(order.get('status'))}
claimer: ${order.get('claimer')}
url: ${order.get('url')}`, { code: true })
    }
  } else if (command === 'claim') {
    if (!canCook(message.member)) return
    const affectedOrderCount = await Orders.update({ status: 1, claimer: message.author.id }, { where: { id: args.shift(), claimer: { [Op.eq]: null } } })
    console.log(affectedOrderCount)
    if (!affectedOrderCount[0]) message.reply('Couldn\'t find that order or it has already been claimed')
    else message.reply('You have claimed the order')
  } else if (command === 'delticket') {
    if (!canCook(message.member)) return
    const deletedOrdersCount = await Orders.destroy({ where: { id: args.shift() } })
    if (!deletedOrdersCount) message.reply('Couldn\'t find that order')
    else message.reply('Order deleted')
  } else if (command === 'cook') {
    const id = args.shift()
    if (!canCook(message.member) || message.channel.id !== kitchenChannel) return
    const order = await Orders.findOne({ where: { id: id, claimer: message.author.id } })
    if (!order) return message.reply('Either this order doesn\'t exist, or you haven\'t claimed it')
    await message.channel.send('The next message you send will be set as the order\'s image Only URLs are supported atm :cry')
    const response = await message.channel.awaitMessages(_ => true, { max: 1, time: 30000 })
    console.log(response)
    if (!response.size) return message.reply('You didn\'t respond in time')
    try {
      await Orders.update({ status: 2, url: response.first().content }, { where: { id: id } })
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        return message.channel.send('That doesn\'t look like a URL to me')
      }
    }
    message.channel.send('Your donut will take 3 minutes to cook')

    await timeout(180000)

    message.reply('Your donut has finished cooking')

    await Orders.update({ status: 3 }, { where: { id: id } })

    // DELIVERY!!!

    const finalOrder = await Orders.findOne({ where: { id: id } })

    console.log(finalOrder.dataValues.channel == '296022747182530562')

    const channel = client.channels.find(chan => chan.id == finalOrder.get('channel'))
    const user = channel.guild.members.find(member => member.id == finalOrder.get('user'))
    const url = finalOrder.get('url')

    channel.send(`${user}, here's your order! I know you love this bot. In case you didn't know, upkeeping a bot takes money. You can help keep us operating and our gears running smooth by being a patron over at https://patreon.com/discorddonuts. If you want to provide feedback, please use d!feedback. If you want to leave a tip, use d!tip.
${url}`)

    await Orders.destroy({ where: { id: id } })

  }
})

function generateID (length) {
  let pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890'
  let str = 0
  for (let i = 0; i < length; i++) {
    str += pos.charAt(Math.floor(Math.random() * pos.length))
  }
  return str
}

client.login(token)
