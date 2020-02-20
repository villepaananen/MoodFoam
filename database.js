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
pgp.pg.defaults.ssl = true;

const cn = process.env.DATABASE_URL;
const db = pgp(cn);

module.exports = db;
