const express = require("express");
const Datastore = require("nedb");
require("dotenv").config();

const port = process.env.PORT || 3000;

const { Client } = require("pg");

const client = new Client({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_SERVER_NAME,
  port: process.env.PORT,
  database: process.env.DATABASE_NAME,
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client
  .connect()
  .then(() => console.log("Connected to db successfully"))
  .then(() => client.query("select * from ***REMOVED***"))
  .then(results => console.table(results.rows))
  .catch(e => console.log);

const app = express();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb"
  })
);

// add a experiment response to the database
app.post("/", (request, response) => {
  const data = {
    data: request.body,
    timestamp: Date.now()
  };

  const query = {
    text: "INSERT INTO ***REMOVED***(response) VALUES($1)",
    values: [data]
  };

  console.log(query);

  client.query(query);
});

// return all of the data in the database
app.get("/", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
    }
    response.json(data);
  });
});
