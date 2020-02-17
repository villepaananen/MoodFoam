const pgp = require("pg-promise")();

const cn = process.env.DATABASE_URI;
const db = pgp(cn);

function saveResponse(data) {
  db.none("INSERT INTO responses(response, timestamp) VALUES($1, $2)", [
    data,
    new Date()
  ])
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "Inserted one response"
      });
    })
    .catch(err => {
      return console.error(err);
    });
}

module.exports = { saveResponse };
