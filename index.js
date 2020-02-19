require("dotenv").config();
const db = require("./database.js");
const express = require("express");
var cookieParser = require("cookie-parser");

const port = process.env.PORT || 5500;

const cookieoptions = {
  maxAge: 1000 * 60 * 60 * 24 * 14
};

const app = express();
app.use(cookieParser());
app.listen(port, () => console.log(`Moodfoam app listening on port ${port}!`));
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb"
  })
);

// add the experiment response to the database
app.post("/", (req, res) => {
  let cookieid = req.cookies.id;
  if (cookieid === undefined) {
    cookieid = getRandomNumber();
    res.cookie("id", cookieid, cookieoptions);
    res.send("cookie set");
    console.log("Cookie created successfully", cookieid);
  } else {
    console.log("Cookie exists", cookieid);
  }
  db.none("INSERT INTO responses(response, timestamp, id) VALUES($1, $2, $3)", [
    { data: req.body },
    new Date(),
    cookieid
  ])
    .then(() => {
      console.log("DB insert success");
      //res.send("Response sent successfully");
    })
    .catch(err => {
      console.log(err);
    });
  //res.redirect(307, "end.html");
});

function getRandomNumber() {
  let randomNumber = Math.random().toString();
  randomNumber = randomNumber.substring(2, randomNumber.length);
  return randomNumber;
}
