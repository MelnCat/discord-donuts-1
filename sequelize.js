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
	},
	ticketMessageID: Sequelize.TEXT,
	timeLeft: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	cookTimeLeft: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	deliveryTimeLeft: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	whenDoneCooking: {
		type: Sequelize.INTEGER
	},
	wheExpire: {
		type: Sequelize.INTEGER
	}
});

const WorkerInfo = sequelize.define("workerinfo", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false,
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
		type: Sequelize.TEXT,
		allowNull: false,
	},
	lastDeliver: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	lastCookIds: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	lastDeliversIds: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
});
const MonthlyInfo = sequelize.define("monthlyinfo", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false,
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
		type: Sequelize.TEXT,
		allowNull: false,
	},
	lastDeliver: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
});
const Applications = sequelize.define("applications", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false,
	},
	application: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	code: {
		type: Sequelize.TEXT,
		allowNull: false,
	}
});
const Ratings = sequelize.define("ratings", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false,
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
const Prefixes = sequelize.define("prefixes", {
	id: {
		type: Sequelize.CHAR(18),
		unique: true,
		primaryKey: true,
		allowNull: false,
	},
	prefix: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
});
const PrecookedDonuts = sequelize.define("precookedDonuts", {
	name: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	url: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

module.exports = {
	Sequelize,
	Op,
	sequelize,
	Orders,
	Blacklist,
	Prefixes,
	PrecookedDonuts,
	WorkerInfo,
	Applications,
	MonthlyInfo,
	Ratings,
};
