const options = {
  error: function(error, e) {
    if (e.cn) {
      // A connection-related error;
      console.log("CN:", e.cn);
      console.log("EVENT:", error.message);
    }
  }
};

const pgp = require("pg-promise")(options);

const cn = {
  host: process.env.DATABASE_SERVER_NAME,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: true
};

const db = pgp(cn);

module.exports = db;
