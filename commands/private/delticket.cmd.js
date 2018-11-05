const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { Orders, Op } = require("../../sequelize");
const { canCook } = require("../../permissions");

module.exports =
   new DDCommand()
      .setName("delticket")
      .addAlias("delorder")
      .setDescription("Delete tickets.")
      .setPermissions(canCook)
      .setFunction(async (message, args, client) => {
         let reason = args[1];
         if (!args[0]) return message.channel.send("<:no:501906738224562177> **Please provide a valid ID.**");
         if (!args[0].match(/^0[a-zA-Z0-9]{6}/)) return message.channel.send("<:no:501906738224562177> **That isn't a valid ID, please try again.**");
         if (!reason) reason = "None specified.";

         const order = await Orders.findById(args[0]);

         if (!order) return message.reply(`<:no:501906738224562177> **Failed to fetch order \`${args[0]}\`, please try again.**`);
         if (order.status === 4) return message.reply("<:no:501906738224562177> **The order you requested to be deleted was already delivered.**");
         if (order.status > 4) return message.reply(`<:no:501906738224562177> **Order \`${args[0]}\` has already been deleted!**`);

         await order.update({ status: 5 });
         await message.channel.send(`<:yes:501906738119835649> **Order \`${args[0]}\` was successfully deleted!**`);
      });
