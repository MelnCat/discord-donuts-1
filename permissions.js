const { botOwners, employeeRole } = require("./auth.json");

const isBotOwner = (client, member) => botOwners.includes(member.id);

const canCook = (client, member) => client.guilds.get("294619824842080257").members.get(member.id) ? client.guilds.get("294619824842080257").members.get(member.id).roles.has(employeeRole) : false;

const canEditGuild = (client, member) => member.hasPermission("MANAGE_GUILD");

const isBotAdmin = (client, member) => client.guilds.get("294619824842080257").members.get(member.id) ? client.guilds.get("294619824842080257").members.get(member.id).hasPermission("MANAGE_GUILD") : false;

const everyone = () => true;

module.exports = {
	isBotOwner,
	canCook,
	everyone,
	canEditGuild,
	isBotAdmin,
};
