const Discord = require("discord.js");

/**
 * Class representing a Discord Donuts command
 */
class DDCommand {
	constructor(options) {
		this.alias = [];
	}
	/**
	 * Sets the name of the command
	 * @param { String } name The name of the command
	 * @returns { DDCommand } The command with the name added
	 */
	setName(name) {
		this.name = name;
		return this;
	}
	addAlias(alias) {
		this.alias.push(alias);
		return this;
	}
	addAliases() {
		this.alias.push.apply(this.alias, arguments);
		return this;
	}
	/**
	 * Sets the description of the command
	 * @param { String } description The description of the command
	 * @returns { DDCommand } The command with the description added
	 */
	setDescription(description) {
		this.description = description;
		return this;
	}

	/**
	 * @callback PermissionFunction
	 * @param { Discord.GuildMember } member The guild member object of the person running the command
	 * @returns { Boolean }
 	 */

	/**
	 * Sets the required permissions for running the command
	 * @param { PermissionFunction } permissionFunction
	 */
	setPermissions(permissionFunction) {
		this.permissions = permissionFunction;
		return this;
	}

	setCategory(category) {
		this.category = category;
		return this;
	}

	/**
	 *
	 * @callback ExecFunction
	 * @param { Discord.Message } message The full message
	 * @param { [String] } args The arguments to the command as a space seperated array
	 * @param { Discord.Client } client The bot's client
	 */

	/**
	 * Sets the executed function for the command
	 * @param { ExecFunction } execFunction The code to be run for the command
	 * @returns { DDCommand } The command with the function added
	 */
	setFunction(execFunction) {
		this.execFunction = execFunction;
		return this;
	}

	/**
	 * Gets the name of the command
	 * @returns { String | TypeError } Either the name, or a TypeError
	 */
	getName() {
		return this.name || new TypeError("A name has not been specified for this command");
	}
	getAlias(n) {
		if (!n) return this.alias || new TypeError("An alias has not been specified for this command");
		if (isNaN(n)) return new TypeError(`Expected integer, recieved ${typeof n}`);
		if (!this.alias[n]) return new TypeError("The integer is too high.");
		return this.alias[n] || new TypeError("An alias has not been specified for this command");
	}
	/**
	 * Gets the description of the command
	 * @returns { String | TypeError } Either the description, or a TypeError
	 */
	getDescription() {
		return this.description || new TypeError("A description has not been specified for this command");
	}

	/**
	 * Gets the permissions required to run the command
	 * @param { Discord.GuildMember } member The member to test the permissions on
	 * @returns { PermissionFunction | TypeError }
	 */
	getPermissions(member) {
		return this.permissions(member) || new TypeError("No permissions have been set for this command");
	}

	getCategory() {
		return this.description || new TypeError("A category has not been specified for this command");
	}

	/**
	 * Gets the executable function of the command
	 * @param { Discord.Message } message The full message
	 * @param { [String] } args A space seperated array of the arguments
	 * @param { Discord.Client} client The bot's client
	 * @returns { execFunction | TypeError } Either the command, or a TypeError
	 */
	async runFunction(message, args, client) {
		return this.execFunction(message, args, client) || new TypeError("A function has not been specified for this command");
	}
}

module.exports = DDCommand;
