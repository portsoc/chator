const express = require('express');
const mysql = require('mysql2/promise');
const GoogleAuth = require('simple-google-openid');

const config = require('./config');
const util = require('./util');

const globalConnection = mysql.createConnection(config.mysql);

const router = express.Router();

router.get('/messages', getMessages);
router.post('/messages', GoogleAuth.guardMiddleware(), postMessage);

async function getMessages (req, res) {
  try {
    res.json(await getMessagesFromDB(req.query.since));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function postMessage (req, res) {
  if (!util.checkBodyIsValid(req, res)) return;

  let photoUrl = null;
  if (req.user) {
    photoUrl = req.user.photos[0].value;
  }

  try {
    await saveMessageInDB(req.body.value, photoUrl);
    res.json(await getMessagesFromDB());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function saveMessageInDB (msg, url) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO messages (message,url) VALUES (?,?)',
    [msg, url]);
}

async function getMessagesFromDB (since) {
  const myConn = await globalConnection;
  let query = 'SELECT id, message, url FROM messages ORDER BY id DESC LIMIT 50';
  if (since != null) {
    query = myConn.format('SELECT id, message, url FROM messages WHERE id > ? ORDER BY id DESC LIMIT 50', since);
  }
  const [rows] = await myConn.execute(query);

  return rows.map((r) => ({
    id: r.id,
    message: r.message,
    url: r.url,
  }));
}

module.exports = router;
