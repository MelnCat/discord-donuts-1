const { botOwners, employeeRole } = require("./auth.json");

const isBotOwner = member => botOwners.includes(member.id);

const canCook = member => member.roles.has(employeeRole);

const everyone = () => true;

module.exports = {
	isBotOwner,
	canCook,
	everyone,
};
