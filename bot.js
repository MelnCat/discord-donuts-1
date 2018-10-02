const Discord = require('discord.js')

const fs = require('fs')

const { Orders, Blacklist } = require('./sequelize')

const { token, ticketChannel, prefix } = require('./auth.json')

const { generateTicket, timeout } = require('./helpers')

const client = new Discord.Client()

client

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('cmd.js'))

commandFiles.forEach(file => {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
})

Orders.beforeCreate(order => {
  // All that i need to do here, is to run `generateTicket(client,order) and send it to the orders channel, no matter which shard
  client.api.channels('294620411721940993').messages.post({
    data: { 
      embed: generateTicket(client, order)
    }
  })
})

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
  Blacklist.sync()
})

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if (!client.commands.has(command)) return

  try {
    client.commands.get(command).execute(message,args)
  } catch (e) {
    console.log(e)
    message.reply('An error occured')
  }
})

client.login(token)
