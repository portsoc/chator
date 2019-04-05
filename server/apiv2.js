const express = require('express');
const GoogleAuth = require('simple-google-openid');

const util = require('./util');
const db = require('./db');

const router = express.Router();

router.get('/messages', getMessages);
router.post('/messages', GoogleAuth.guardMiddleware(), postMessage);

async function getMessages(req, res) {
  try {
    res.json(await db.getMessages(req.query.since));
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

async function postMessage(req, res) {
  if (!util.checkBodyIsValid(req, res)) return;

  let photoUrl = null;
  if (req.user) {
    photoUrl = req.user.photos[0].value;
  }

  try {
    await db.saveMessage(req.body.value, photoUrl);
    res.json(await db.getMessages());
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

module.exports = router;
