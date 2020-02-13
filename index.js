const db = require("./db");
const express = require("express");
require("dotenv").config();

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

const port = process.env.PORT || 5500;

const app = express();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb"
  })
);

// add a experiment response to the database
app.post("/", async (request, response) => {
  const query = {
    text: "INSERT INTO responses(response, timestamp) VALUES($1, $2)",
    values: [request.body, new Date()]
  };

  db.client(query.text, query.values);

  /*   await client
    .connect()
    .then(() => console.log("Connected to db successfully"))
    .catch(e => console.error(e));

  await client.query(query);
  await client.end(); */
});
