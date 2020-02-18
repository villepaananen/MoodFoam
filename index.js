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
  db.saveResponse(req.body);
  if (res.status === 200) {
    console.log("Data sent successfully");
  }
  res.redirect("end");
});
