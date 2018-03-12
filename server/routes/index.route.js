const { Router } = require('express');
const messagesRoute = require('./messages.route');

const router = Router();

router.use(messagesRoute);

module.exports = router;
