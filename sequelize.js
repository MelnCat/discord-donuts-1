const { dbUsername, dbPassword, dbName } = require("./auth.json");

const Sequelize = require("sequelize");

const Op = Sequelize.Op;

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
	dialect: "mysql",
	logging: false,
	operatorsAliases: false,
});

const Orders = sequelize.define("orders", {
	id: {
		type: Sequelize.CHAR(7),
		unique: true,
		primaryKey: true,
		allowNull: false,
	},
	user: {
		type: Sequelize.CHAR(18),
		allowNull: false,
	},
	description: {
		type: Sequelize.TEXT,
		validate: {
			not: /^\s*$/,
		},
	},
	channel: {
		type: Sequelize.CHAR(18),
		allowNull: false,
	},
	status: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	claimer: Sequelize.CHAR(18),
	url: {
		type: Sequelize.TEXT,
		validate: {
			isUrl: true,
		},
	},
	ticketMessageID: Sequelize.TEXT,
});

const Blacklist = sequelize.define("blacklist", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false,
		validate: {
			not: /^\s*$/,
		},
	},
	reason: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
});

module.exports = {
	Sequelize,
	Op,
	sequelize,
	Orders,
	Blacklist,
};
