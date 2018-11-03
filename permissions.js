const { botOwners, employeeRole } = require("./auth.json");

const isBotOwner = member => botOwners.includes(member.id);

const canCook = member => member.roles.has(employeeRole);

const canEditGuild = member => member.hasPermission("MANAGE_GUILD");

const everyone = () => true;

module.exports = {
	isBotOwner,
	canCook,
	everyone,
	canEditGuild,
};
