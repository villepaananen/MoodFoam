require("dotenv").config();
const db = require("./database.js");
const express = require("express");

const port = process.env.PORT || 5500;

const app = express();
app.listen(port, () => console.log(`Moodfoam app listening on port ${port}!`));
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb"
  })
);

// add the experiment response to the database
app.post("/", (req, res) => {
  db.none("INSERT INTO ***REMOVED***(response, timestamp) VALUES($1, $2)", [
    { trial: req.body },
    new Date()
  ])
    .then(() => {
      console.log("DB insert success");
    })
    .catch(err => {
      console.log(err);
    });
  res.redirect("/end.html");
});
