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

async function query(text, params) {
  try {
    await client.connect();
    await client.query(text, params);
    await client.end();
  } catch (error) {
    console.log(error);
  }
}

module.exports.query = query(text, params);
