const express = require("express");
const Datastore = require("nedb");
require("dotenv").config();

const port = process.env.PORT || 3000;

const { Client } = require("pg");

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_SERVER_NAME,
  port: process.env.PORT,
  database: process.env.DATABASE_NAME,
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const client = new Client({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_SERVER_NAME,
  port: process.env.PORT,
  database: process.env.DATABASE_NAME,
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

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
  const data = request.body;
  const now = new Date();

  const query = {
    text: "INSERT INTO ***REMOVED***(response) VALUES($1, $2)",
    values: [data, now]
  };
  (async () => {
    const client = await pool.connect();
    try {
      const res = await client.query(query);
    } catch (e) {
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => console.error(e.stack));

  /*   await client.connect()
  await client.query(query)
  await client.end() */
});
