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
         const m = await message.channel.send("Fetching time stamp values..");
         const endTime = Date.now();
         await m.edit(`Message: \`${endTime - startTime}ms\`\nDiscord Heartbeat: \`${Math.round(this.client.ws.ping)}ms\``);
         return;
      });
