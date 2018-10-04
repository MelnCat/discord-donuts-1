const { everyone } = require('../../permissions');

module.exports = {
  name: 'support',
  description: 'The invite for the support server.',
  permissions: everyone,
  execute(message, args, client) {
    message.channel.send('Join The Support Server Here :arrow_forward: https://discord.gg/Kkyk3fM.');
  },
};
