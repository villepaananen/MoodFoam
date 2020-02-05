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

module.exports = {
  query: (text, params) => {
    client.connect();
    client
      .query(text, params)
      .then(result => console.log(result))
      .catch(e => console.error(e.stack))
      .then(() => client.end());
  }
};
