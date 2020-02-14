const db = require("./db");
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
app.post("/", async (request, response) => {
  const text = "INSERT INTO responses(response, timestamp) VALUES($1, $2)";
  const values = [JSON.stringify(request.body), new Date()];

  if (IsValidJSONString(JSON.stringify(request.body))) {
    db.insert(text, values);
    window.location.replace("/end.html");
  } else console.error("Not JSON:", request.body);
});

function IsValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
