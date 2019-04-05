'use strict';

/* global gapi */

window.addEventListener('load', initialize);
const AUTOREFRESH_INTERVAL = 5000; // 5s
let elMsg;
let elTyping;

async function initialize() {
  elTyping = document.querySelector('#typing');
  elMsg = document.querySelector('#newmsg');
  elMsg.addEventListener('keydown', keyDownHandler);
  connectWS();
}

let ws = null;
function connectWS() {
  const origin = window.location.hostname + ':' + (window.location.port || 80);
  ws = new WebSocket(`ws://${origin}/wsv1/`);
  ws.addEventListener('message', handleWSMessage);
  ws.addEventListener('open', sendLoginMessage);
  ws.addEventListener('error', handleWSClose);
  ws.addEventListener('close', handleWSClose);
  // if we want to write, login on open
}

function wsConnected() {
  return ws != null && ws.readyState === WebSocket.OPEN;
}

// todo document payload design
// todo posting over WS
// todo typing indication should include name

function sendLoginMessage() {
  if (!wsConnected()) return;

  const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  if (!token) return;

  ws.send(JSON.stringify({
    type: 'login',
    token,
  }));
}

function handleWSMessage(event) {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'message':
      fillMessages([data.message], true);
      break;
    case 'allMessages':
      fillMessages(data.messages);
      break;
    case 'typing':
      indicateOthersTyping(data.pictures);
      break;
  }
}

function handleWSClose() {
  setTimeout(loadMessages, AUTOREFRESH_INTERVAL); // start loading messages over HTTP
  // todo back-off reconnect
}

function emitTypingIndication() {
  if (wsConnected()) {
    ws.send(JSON.stringify({
      type: 'typing',
    }));
  }
}

let typingTimeout;

function indicateOthersTyping(pictures) {
  clearEl(elTyping);

  for (let i = 0; i < pictures.length; i++) {
    const img = document.createElement('img');
    img.classList.add('avatar');
    img.alt = 'a user is typing';
    img.src = pictures[i];
    elTyping.appendChild(img);
  }

  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  typingTimeout = setTimeout(clearEl, 5000, elTyping);
}

function clearEl(el) {
  el.textContent = '';
}

function keyDownHandler(e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  emitTypingIndication();

  if (e.key === 'Enter') {
    addMessage();
    e.preventDefault();
  }
}

async function loadMessages(isUpdate = false) {
  let url = '/v2/messages';

  // request only data since the last ID we've seen
  const lastMessage = document.querySelector('li');
  if (lastMessage && lastMessage.dataset.id) {
    url += '?since=' + lastMessage.dataset.id;
  }

  const response = await fetch(url);
  if (!response.ok) {
    console.error('bad response');
    return;
  }

  const data = await response.json();
  fillMessages(data, isUpdate);

  if (data.length > 0) {
    const noMsgEl = document.querySelector('#none');
    if (noMsgEl) noMsgEl.remove();
  }

  if (!wsConnected()) setTimeout(loadMessages, AUTOREFRESH_INTERVAL, true);
}

function fillMessages(data, isUpdate = false) {
  const ol = document.querySelector('#messages');

  data.reverse();
  for (const msg of data) {
    if (document.querySelector(`li[data-id='${msg.id}']`)) {
      continue;
    }
    const li = document.createElement('li');
    li.textContent = msg.message;
    li.dataset.id = msg.id;
    if (isUpdate) li.classList.add('update');

    if (msg.url) {
      const img = document.createElement('img');
      img.src = msg.url;
      img.alt = "poster's photo";
      img.classList.add('avatar');
      li.insertBefore(img, li.childNodes[0]);
    }

    // used for alternating message backgrounds
    if (msg.id % 2) li.dataset.odd = true;
    ol.insertBefore(li, ol.children[0]);
  }
}

async function addMessage(e) {
  if (elMsg.value.trim() === '') {
    elMsg.focus();
    return;
  }

  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const response = await fetch('/v2/messages', {
    method: 'POST',
    body: JSON.stringify({ value: elMsg.value.trim() }),
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + idToken
    }
  });

  if (response.ok) {
    fillMessages(await response.json(), true);
    elMsg.value = '';
    elMsg.focus();
  }
}

window.onSignIn = (googleUser) => {
  document.body.classList.add('logged-in');
  sendLoginMessage();
};
