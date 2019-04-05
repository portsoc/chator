
const mysql = require('mysql2/promise');
const config = require('./config');

const globalConnection = mysql.createConnection(config.mysql);

async function saveMessage(msg, url) {
  const myConn = await globalConnection;
  return myConn.execute(
    'INSERT INTO messages (message,url) VALUES (?,?)',
    [msg, url]);
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

module.exports = {
  getMessages,
  saveMessage,
};
