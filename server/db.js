const mysql = require('mysql2/promise');
const config = require('./config');

const globalConnection = mysql.createConnection(config.mysql);

async function saveMessage(message, url) {
  const myConn = await globalConnection;
  const [rows] = await myConn.execute(
    'INSERT INTO messages (message,url) VALUES (?,?)',
    [message, url]);

  const newMessage = {
    id: rows.insertId,
    message,
    url,
  };
  for (const f of messageListeners) {
    f(newMessage);
  }
}

async function getMessages(since) {
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

const messageListeners = [];

function addMessageListener(f) {
  messageListeners.push(f);
}

module.exports = {
  getMessages,
  saveMessage,
  addMessageListener,
};
