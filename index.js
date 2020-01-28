const express = require('express');
const Datastore = require('nedb');

const port = process.env.PORT || 3000;

const app = express();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(express.static('public'));
app.use(express.json({
    limit: '1mb'
}));

// Create the database
const database = new Datastore('database.db');
database.loadDatabase();

// Define the POST operation
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});