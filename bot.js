const Discord = require('discord.js')

const Sequelize = require('sequelize')
const createEmbed = require('embed-creator')

const { token, employeeRole, kitchenChannel, ticketChannel, dbPassword, botOwners } = require('./auth.json')

const client = new Discord.Client()
const prefix = '!'
const embedColor = parseInt('0x' + Math.floor(Math.random() * 16777215).toString(16))

const generateTicket = order => {
  const user = client.users.get(order.get('user'))
  const channel = client.channels.get(order.get('channel'))
  return createEmbed(
    3447003, {
      name: user.username,
      icon_url: user.avatarURL
    }, ':ticket: New Ticket',
    `${user.username}#${user.discriminator} (${user.id}) would like a donut!`, [{
      name: `Donut Description`,
      value: order.get('description')
    }, {
      name: ':hash: Ticket ID',
      value: order.get('id')
    }, {
      name: ':computer: Guild Information',
      value: `This ticket came from ${channel.guild.name} (${channel.guild.id}) in ${channel.name} (${channel.id}).`
    }, {
      name: ':white_check_mark: Ticket Status',
      value: status(order.get('status'))
    }], {
      text: client.user.username,
      icon_url: client.user.avatarURL
    }
  )
}

/* eslint-disable indent */

const status = code => {
       if (code === 0) return 'Not cooked'
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

const timeout = delay => new Promise(resolve => setTimeout(resolve, delay))

const canCook = member => member.roles.has(employeeRole)

const Op = Sequelize.Op

const sequelize = new Sequelize('donuts', 'pi', dbPassword, {
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false
})

const Orders = sequelize.define('orders', {
  id: {
    type: Sequelize.CHAR(7),
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  user: {
    type: Sequelize.CHAR(18),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    validate: {
      not: /^\s*$/
    }
  },
  channel: {
    type: Sequelize.CHAR(18),
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  claimer: Sequelize.CHAR(18),
  url: {
    type: Sequelize.TEXT,
    validate: {
      isUrl: true
    }
  },
  ticketMessageID: Sequelize.TEXT
})

Orders.beforeCreate(async (order, options) => {
  const ticket = await client.channels.get(ticketChannel).send(generateTicket(order))

Orders.afterCreate((order, options) => {
  timeout(20 * 60 * 1000).then(async () => {
    await order.update({ status: 6 })
    await client.users.get(order.get('user')).send('It has been 20 minutes, and therefore your order has been deleted')
  })
})

Orders.afterUpdate(async (order, options) => {
  if (!order.get('ticketMessageID')) return
  const message = await client.channels.get(ticketChannel).fetchMessage(order.get('ticketMessageID'))
  message.edit(generateTicket(order))
})

client.once('ready', () => {
  console.log('ready')
  Orders.sync()
})

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if (command === 'order') {
    if (!args) return

    const generatedID = generateID(6) // Note that this is actually a 7 char id
    console.log(generatedID)

    const order = await (Orders.create({
      id: generatedID,
      user: message.author.id,
      description: args.join(' '),
      channel: message.channel.id,
      status: 0,
      claimer: null,
      url: null,
      ticketMessageID: null
    }).catch(e => {
      if (e.name === 'SequelizeValidationError') return message.reply('Invalid order, did you actually type a description?')
    }))

    message.channel.send(createEmbed(
      embedColor, null, 'Ticket Created',
      `:ticket: Ticket Placed! Your ticket ID: \`${generatedID}\``
    ))
  } else if (command === 'list') {
    const ordersList = await Orders.findAll({ where: { status: { [Op.lt]: 5 } }, attributes: ['id'] })
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
url: ${order.get('url')}
ticketMessageID: ${order.get('ticketMessageID')}`, { code: true })
    }
  } else if (command === 'claim') {
    if (!canCook(message.member)) return

    const order = await Orders.findOne({ where: { id: args.shift(), claimer: null } })
    if (!order) message.reply('Couldn\'t find that order or it has already been claimed')

    await order.update({ status: 1, claimer: message.author.id })

    await client.users.get(order.get('user')).send(`Guess what? Your ticket has now been claimed by **${message.author.username}**! It should be cooked shortly.`)

    message.reply('You have claimed the order')
  } else if (command === 'delticket') {
    if (!canCook(message.member)) return
    const deletedOrdersCount = await Orders.update({ status: 6 }, { where: { id: args.shift(), status: { [Op.lt]: 5 } }, individualHooks: true })
    if (!deletedOrdersCount) message.reply('Couldn\'t find that order')
    else message.reply('Order deleted')
  } else if (command === 'cook') {
    const id = args.shift()
    if (!canCook(message.member) || message.channel.id !== kitchenChannel) return
    const order = await Orders.findOne({ where: { id: id, claimer: message.author.id } })
    if (!order) return message.reply('Either this order doesn\'t exist, or you haven\'t claimed it')
    await message.channel.send('The next message you send will be set as the order\'s image Only URLs are supported atm :cry')
    const response = await message.channel.awaitMessages(m => m.author.id === order.get('claimer'), { max: 1, time: 30000 })
    if (!response.size) return message.reply('You didn\'t respond in time')
    try {
      await Orders.update({ status: 2, url: response.first().content }, { where: { id: id }, individualHooks: true })
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        return message.channel.send('That doesn\'t look like a URL to me')
      }
    }
    message.channel.send('Your donut will take 3 minutes to cook')

    await timeout(180000)

    message.reply('Your donut has finished cooking and will be delivered shortly')

    await Orders.update({ status: 3 }, { where: { id: id }, individualHooks: true })

    // DELIVERY!!!

    const finalOrder = await Orders.findOne({ where: { id: id } })

    const channel = client.channels.get(finalOrder.get('channel'))
    const user = channel.guild.members.get(finalOrder.get('user'))
    const url = finalOrder.get('url')

    channel.send(`${user}, here's your order! I know you love this bot. In case you didn't know, upkeeping a bot takes money. You can help keep us operating and our gears running smooth by being a patron over at https://patreon.com/discorddonuts. If you want to provide feedback, please use d!feedback. If you want to leave a tip, use d!tip.
${url}`)
  } else if (command === 'clear') {
    if (!botOwners.includes(message.author.id)) return
    const deletedOrders = await Orders.destroy({ where: {} })
    if (deletedOrders) return message.reply('All orders deleted')
    message.reply('An error occured')
  } else if (command === 'eval') {
    if (!botOwners.includes(message.author.id)) return
    try {
      await message.channel.send(eval(args.join(' ')))
    } catch (e) {
      await message.channel.send(e.message)
    }
  } else if (command === 'sql') {
    try {
      const result = await sequelize.query(args.join(' '))
      await message.channel.send(JSON.stringify(result[0]))
    } catch (e) {
      await message.channel.send(e.message)
    }
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
