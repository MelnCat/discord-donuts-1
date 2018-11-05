const DDEmbed = require("../../structures/DDEmbed.struct");
const DDCommand = require("../../structures/DDCommand.struct");

const { everyone } = require("../../permissions");

module.exports =
   new DDCommand()
      .setName("ping")
      .setDescription("Fetches time stamp values.")
      .setPermissions(everyone)
      .setFunction(async (message, args, client) => {
         const startTime = Date.now();
         const m = await message.channel.send("Pong!");
         const endTime = Date.now();
         await m.edit(`Pong! (${endTime - startTime}ms)`);
         return;
      });
