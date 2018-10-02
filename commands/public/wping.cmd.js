const { everyone } = require('../../permissions')

module.exports = {
  name: 'wping',
  description: 'webhook ping...', // TODO: Shouldn't this be websocket?
  permissions: everyone,
  async execute (message, args, client) {
    message.channel.send(`:ping_pong: Pong! Took \`${message.client.ping.toFixed(0)}ms\`!`)
  }
}
