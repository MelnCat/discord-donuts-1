const { db } = require("../Configuration/auth.js");

const r = global.r = require("rethinkdbdash")({
	db: db.db,
	user: db.user,
	password: db.password,
});

module.exports = async() => new Promise(async(resolve, reject) => {
	resolve(r);
});
