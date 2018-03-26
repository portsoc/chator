window.addEventListener('load', initialize);
const newMsgEl = document.querySelector('#newmsg');

const AUTOREFRESH_INTERVAL = 1000; // 1s

async function initialize() {
  newMsgEl.addEventListener('keydown', keyDownHandler);
  loadMessages();
}

function keyDownHandler(e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  if (e.key === 'Enter') {
    addMessage();
    e.preventDefault();
  }
}

async function loadMessages() {
  const response = await fetch('/v2/messages');
  if (!response.ok) {
    console.error('bad response');
    return;
  }

  const data = await response.json();
  fillMessages(data);

  setTimeout(loadMessages, AUTOREFRESH_INTERVAL);
}

function fillMessages(data) {
  const ol = document.querySelector('#messages');

  for (const msg of data.reverse()) {
    if (document.querySelector(`li[data-id='${msg.id}']`)) {
      continue;
    }
    const li = document.createElement('li');
    li.textContent = msg.id + ': ' + msg.message;
    li.dataset.id = msg.id;
    ol.insertBefore(li, ol.children[0]);
  }
}

async function addMessage(e) {
  if (newMsgEl.value.trim() === '') {
    newMsgEl.focus();
    return;
  }

  const response = await fetch('/v2/messages', {
    method: 'POST',
    body: JSON.stringify({ value: newMsgEl.value.trim() }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (response.ok) {
    fillMessages(await response.json());
    newMsgEl.value = '';
    newMsgEl.focus();
  }
}
