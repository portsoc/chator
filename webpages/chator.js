window.addEventListener('load', initialize);
const refreshBtn = document.querySelector('#refresh');
const newMsgEl = document.querySelector('#newmsg');

async function initialize() {
  refreshBtn.addEventListener('click', loadMessages);

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
  const response = await fetch('/messages');
  if (!response.ok) {
    console.error('bad response');
    return;
  }

  const data = await response.json();
  fillMessages(data);
}

function fillMessages(data) {
  const ol = document.querySelector('#messages');
  ol.innerHTML = '';

  for (const msg of data) {
    const li = document.createElement('li');
    li.textContent = msg;
    ol.appendChild(li);
  }
}

async function addMessage(e) {
  if (newMsgEl.value.trim() === '') {
    newMsgEl.focus();
    return;
  }

  const response = await fetch('/messages', {
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
