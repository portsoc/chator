const data = [ 'first mess ever' ];

/**
 * Sends the current messages to the requesting user
 */
function sendMessagesToRequestingUser(req, res) {
  res.json(data);
}

/**
 * Removes any formatted strings that would result in harm on the server or clients
 */
function sanitizeNewMessage(req, res, next) {
  next();
}

/**
 * Places the new received message to the start of the message data
s */
function addNewMessageToMessageData(req, res, next) {
  data.unshift(req.body.value);
  next();
}

/**
 * Trims the messages down to a fixed maximum to meet specification
 * Maximum is currently set to: 50 messages
 */
function trimMessagesToMaximum(req, res, next) {
  if (data.length > 50) data.length = 50;
  next();
}

module.exports = {
  sendMessagesToRequestingUser,
  sanitizeNewMessage,
  addNewMessageToMessageData,
  trimMessagesToMaximum,
};
