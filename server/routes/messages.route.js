const { Router } = require('express');
const messages = require('../middleware/messages.controller');

const router = Router();

router.get('/messages', [
  messages.sendMessagesToRequestingUser.bind(this),
]);

router.post('/messages', [
  messages.sanitizeNewMessage.bind(this),
  messages.addNewMessageToMessageData.bind(this),
  messages.trimMessagesToMaximum.bind(this),
  messages.sendMessagesToRequestingUser.bind(this),
]);

module.exports = router;
