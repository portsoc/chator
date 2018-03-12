window.addEventListener('load', initialize);
const submitBtn = document.querySelector('#submit');

async function initialize() {
  submitBtn.addEventListener('click', addMessage);

  const response = await fetch('/messages');
  if (!response.ok) {
    console.error('bad response');
    return;
  }

  const data = await response.json();

  const ol = document.querySelector('#messages');
  ol.innerHTML = '';

  for (const msg of data) {
    const li = document.createElement('li');
    li.textContent = msg;
    ol.appendChild(li);
  }
}

function addMessage(e) {
  const newMsgEl = document.querySelector('#newmsg');
  const ol = document.querySelector('#messages');

  const li = document.createElement('li');
  li.textContent = newMsgEl.value;
  ol.insertBefore(li, ol.children[0]);
}
