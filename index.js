const db = require("./database.js");
const express = require("express");
require("dotenv").config();

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
app.post("/", async (req, res) => {
  const text = "INSERT INTO ***REMOVED***(response, timestamp) VALUES($1, $2)";
  const values = [JSON.stringify(req.body)];
  if (res.status == 200) {
    console.log("Data sent successfully");
  }
  if (IsValidJSONString(JSON.stringify(req.body))) {
    db.insert(text, values);
    window.location.replace("/end.html");
  } else console.error("Not JSON:", req.body);
});

function IsValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
