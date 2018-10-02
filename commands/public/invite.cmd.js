const { everyone } = require('../../permissions')

module.exports = {
  name: 'invite',
  description: 'the invite code for the bot',
  permissions: everyone,
  execute (message, args, client) {
    message.channel.send('Invite me here :arrow_forward: https://donuts.its-mustard.me')
  }
}
