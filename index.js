const express = require("express");
const Datastore = require("nedb");
require("dotenv").config();

const port = process.env.PORT || 3000;

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

client.query(
  "SELECT table_schema,table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  }
);

const app = express();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb"
  })
);

// Create the database
const database = new Datastore("database.db");
database.loadDatabase();

// Define the POST operation
app.post("/api", (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

// Define the GET operation
app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
    }
    response.json(data);
  });
});
