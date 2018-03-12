window.addEventListener('load', initialize);
const submitBtn = document.querySelector('#submit');
const refreshBtn = document.querySelector('#refresh');

async function initialize() {
  submitBtn.addEventListener('click', addMessage);
  refreshBtn.addEventListener('click', loadMessages);

  loadMessages();
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
  const newMsgEl = document.querySelector('#newmsg');
  const newMessage = newMsgEl.value;

  // Clearing the input after the user submits there message
  newMsgEl.value = '';

  if (newMessage.trim() === '') return;

  const response = await fetch('/messages', {
    method: 'POST',
    body: JSON.stringify({ value: newMessage.trim() }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (response.ok) {
    fillMessages(await response.json());
  }
}
