'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const config = require('./config');

const app = express();
app.use(bodyParser.json());

const globalConnection = mysql.createConnection(config.mysql);


app.get('/messages', v1GetMessages);
app.post('/messages', v1PostMessage);
app.get('/v2/messages', v2GetMessages);
app.post('/v2/messages', v2PostMessage);

async function v1GetMessages(req, res) {
  try {
    res.json(await getMessagesFromDB());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function v2GetMessages(req, res) {
  try {
    res.json(await getMessagesFromDBv2());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function v1PostMessage(req, res) {
  if (!checkBodyIsValid(req, res)) return;

  try {
    await saveMessageInDB(req.body.value);

    res.json(await getMessagesFromDB());

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function v2PostMessage(req, res) {
  if (!checkBodyIsValid(req, res)) return;

  try {
    await saveMessageInDB(req.body.value);
    res.json(await getMessagesFromDBv2());

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}


function checkBodyIsValid(req, res) {
  if (req.body == null || req.body.value == null ||
      typeof req.body.value !== 'string' ||
      req.body.value.trim() === '') {
    res.sendStatus(400);
    return false;
  }

  return true;
}

async function saveMessageInDB(msg) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO messages (message) VALUES (?)',
    [msg]);
}

async function getMessagesFromDB() {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT id, message FROM messages ORDER BY id DESC LIMIT 50');

  return rows.map((r) => r.message);
}

async function getMessagesFromDBv2() {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'SELECT id, message FROM messages ORDER BY id DESC LIMIT 50');

  return rows.map((r) => ({id: r.id, message: r.message}));
}

// static routes

app.use(express.static('./webpages'));

// starting server
app.listen(8080);
