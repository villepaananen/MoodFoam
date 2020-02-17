const pgp = require("pg-promise")();
const cn = process.env.DATABASE_URI;
const db = pgp(cn);

function saveResponse(req, res, next) {
  const responseJSON = req.params.response;
  console.log(responseJSON);
  return false;
  db.none("INSERT INTO responses(response, timestamp) VALUES($1, $2)", [
    responseJSON,
    new Date()
  ])
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "Inserted one response"
      });
    })
    .catch(err => {
      return next(err);
    });
}

module.exports = saveResponse;
