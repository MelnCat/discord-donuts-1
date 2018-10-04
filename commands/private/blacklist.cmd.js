const { Blacklist } = require('../../sequelize');

const { isBotOwner } = require('../../permissions');

module.exports = {
  name: 'blacklist',
  permissions: isBotOwner,
  description: 'Blacklist a user or a guild, with a reason.',
  async execute(message, args, client) {
    try {
      await Blacklist.create({ id: args.shift(), reason: args.shift() });
    } catch (e) {
      console.log(e);
      return message.reply('Error: Did you run the command properly?');
    }
    message.reply('Blacklist added!');
  },
};
