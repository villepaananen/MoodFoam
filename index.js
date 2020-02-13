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

// add a experiment response to the database
app.post("/", async (request, response) => {
  const query = {
    text: "INSERT INTO ***REMOVED***(response, timestamp) VALUES($1, $2)",
    values: [request.body, new Date()]
  };

  if (IsValidJSONString(request.body)) {
    db.insert(query.text, query.values);
  } else console.error(request.body);
});

function IsValidJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
