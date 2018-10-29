const { db: { dbUsername, dbPassword, dbName, dbHostname } } = require("./auth.json");

const Sequelize = require("sequelize");

const Op = Sequelize.Op;

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
	host: dbHostname,
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

const WorkerInfo = sequelize.define("workerInfo", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false
	},
	username: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	cooks: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	delivers: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	lastCook: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},
	lastDeliver: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},
	lastCookID: {
		type: Sequelize.CHAR(18),
		allowNull: false,
	},
	lastDeliverID: {
		type: Sequelize.CHAR(18),
		allowNull: false,
	},

});
const overall = sequelize.define("overall", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false
	},
	username: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	cooks: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	delivers: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	lastCook: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},
	lastDeliver: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},
});
const ratings = sequelize.define("ratings", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false
	},
	rate1: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rate2: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rate3: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rate4: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rate5: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
});
module.exports = {
	Sequelize,
	overall,
	Op,
	sequelize,
	Orders,
	Blacklist,
	WorkerInfo,
	ratings,
};
