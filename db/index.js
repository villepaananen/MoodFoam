const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: false
});

async function insert(text, params) {
  try {
    await client.connect();
    await client.query(text, params);
    await client.end();
  } catch (error) {
    console.log(error);
  }
}

module.exports = { insert };
