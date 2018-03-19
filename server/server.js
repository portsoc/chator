'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const config = require('./config');

const app = express();
app.use(bodyParser.json());

const globalConnection = mysql.createConnection(config.mysql);

app.get('/messages', async (req, res) => {
  try {
    res.json(await getMessagesFromDB());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.post('/messages', async (req, res) => {
  if (req.body == null || req.body.value == null ||
      typeof req.body.value !== 'string' ||
      req.body.value.trim() === '') {
    res.sendStatus(400);
    return;
  }

  try {

    const myConn = await globalConnection;
    await myConn.execute(
      'INSERT INTO messages (message) VALUES (?)',
      [req.body.value]);

    res.json(await getMessagesFromDB());

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
})

async function getMessagesFromDB() {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT message FROM messages ORDER BY id DESC LIMIT 50');

  return rows.map((r) => r.message);
}

// static routes

app.use(express.static('./webpages'));

// starting server
app.listen(8080);
