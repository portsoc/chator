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

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    switch (data.type) {
      case 'typing':
        sendTypingIndication(ws);
        break;
    }
  });
});

let lastTypingIndication = 0;
const TYPING_INDICATION_INTERVAL = 1500;

function sendTypingIndication(ws) {
  if (wss) {
    const now = Date.now();
    ws.lastTypingIndication = now;

    if (lastTypingIndication < now - TYPING_INDICATION_INTERVAL) {
      lastTypingIndication = now;
      const count = countTypingWSClients();

      broadcast({
        type: 'typing',
        count,
      });
    }
  }
}

function countTypingWSClients() {
  const now = Date.now();
  let count = 0;
  if (wss) {
    for (const client of wss.clients) {
      if (client.lastTypingIndication > now - TYPING_INDICATION_INTERVAL) {
        count += 1;
      }
    }
  }
  return count;
}

function emitMessage(message) {
  broadcast({
    type: 'message',
    message,
  });
}

function broadcast(wsMessage) {
  if (wss) {
    if (typeof wsMessage === 'object') wsMessage = JSON.stringify(wsMessage);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(wsMessage);
      }
    }
  }
}

module.exports = router;
