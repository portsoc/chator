'use strict';

/* global gapi */

window.addEventListener('load', initialize);
const AUTOREFRESH_INTERVAL = 1000; // 1s
let elMsg;

async function initialize () {
  elMsg = document.querySelector('#newmsg');
  elMsg.addEventListener('keydown', keyDownHandler);
  loadMessages();
}

function keyDownHandler (e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  if (e.key === 'Enter') {
    addMessage();
    e.preventDefault();
  }
}

async function loadMessages (isUpdate = false) {
  const response = await fetch('/v2/messages');
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

  setTimeout(loadMessages, AUTOREFRESH_INTERVAL, true);
}

function fillMessages (data, isUpdate = false) {
  const ol = document.querySelector('#messages');

  for (const msg of data.reverse()) {
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
      img.className = 'avatar';
      li.insertBefore(img, li.childNodes[0]);
    }

    // used for alternating message backgrounds
    if (msg.id % 2) li.dataset.odd = true;
    ol.insertBefore(li, ol.children[0]);
  }
}

async function addMessage (e) {
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
};
