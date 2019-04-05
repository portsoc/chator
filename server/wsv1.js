const express = require('express');
const WebSocket = require('ws');
const GoogleAuth = require('simple-google-openid');

const config = require('./config');
const auth = GoogleAuth(config.googleClientID);

const router = express.Router();

const db = require('./db');
db.addMessageListener(emitMessage);

let wss;
router.setWss = _wss => { wss = _wss; };

router.ws('/', async (ws, req) => {
  const wsMessage = {
    type: 'allMessages',
    messages: await db.getMessages()
  };
  ws.send(JSON.stringify(wsMessage));

  ws.on('message', async (msg) => {
    const data = JSON.parse(msg);
    switch (data.type) {
      case 'typing':
        sendTypingIndication(ws);
        break;
      case 'login':
        ws.user = await auth.verifyToken(data.token);
        console.log('logged in ', ws.user);
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
      const pictures = tallyTypingWSClients();

      broadcast({
        type: 'typing',
        pictures,
      });
    }
  }
}

function tallyTypingWSClients() {
  const now = Date.now();
  const pictures = [];
  if (wss) {
    for (const client of wss.clients) {
      let photoUrl = '';
      if (client.user && client.user.photos) {
        photoUrl = client.user.photos[0].value;
      }
      if (photoUrl && client.lastTypingIndication > now - TYPING_INDICATION_INTERVAL) {
        pictures.push(photoUrl);
      }
    }
  }
  return pictures;
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
