const { botOwners, employeeRole } = require('./auth.json')

const isBotOwner = member => botOwners.includes(member.id)

const canCook = member => member.roles.has(employeeRole) || isBotOwner(member)

const everyone = () => true

module.exports = {
  isBotOwner,
  canCook,
  everyone
}
