const express = require('express');
const mysql = require('mysql2/promise');

const config = require('./config');
const util = require('./util');

const globalConnection = mysql.createConnection(config.mysql);

const router = express.Router();

router.get('/messages', getMessages);
router.post('/messages', postMessage);

async function getMessages(req, res) {
  try {
    res.json(await getMessagesFromDB());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function postMessage(req, res) {
  if (!util.checkBodyIsValid(req, res)) return;

  try {
    await saveMessageInDB(req.body.value);
    res.json(await getMessagesFromDB());

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
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

  return rows.map((r) => ({id: r.id, message: r.message}));
}


module.exports = router;
