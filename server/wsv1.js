const express = require('express');
const WebSocket = require('ws');

const router = express.Router();

const db = require('./db');
db.addMessageListener(emitMessage);

let wss;
router.setWss = _wss => { wss = _wss; };

router.ws('/', async (ws, req) => {
  const wsMessage = JSON.stringify({
    type: 'allMessages',
    messages: await db.getMessages()
  });
  ws.send(wsMessage);
});

function emitMessage(message) {
  if (wss) {
    const wsMessage = JSON.stringify({
      type: 'message',
      message,
    });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(wsMessage);
      }
    }
  }
}

module.exports = router;
