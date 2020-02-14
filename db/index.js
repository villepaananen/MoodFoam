const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: true
});

async function insert(text) {
  try {
    await client.connect();
    await client.query(text);
    await client.end();
  } catch (error) {
    console.log(error);
  }
}

module.exports = { insert };
