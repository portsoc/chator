const data = [ 'first mess ever' ];

function sendMessagesToRequestingUser(req, res) {
  res.json(data);
}

function sanitizeNewMessage(req, res, next) {
  next();
}

function addNewMessageToMessage(req, res, next) {
  data.unshift(req.body.value);
  if (data.length > 50) data.length = 50;
  next();
}

module.exports = {
  sendMessagesToRequestingUser,
  sanitizeNewMessage,
  addNewMessageToMessage,
}
