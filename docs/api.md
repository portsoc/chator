# API for Ch@or

This document focuses on the current API; version 1 of the API is described in `api-v1.md`

The API offers two protocols:

1. HTTP is available everywhere, allows loading messages and submitting a new message, and needs to be polled to get new messages.
2. Web Sockets, when available, allows the server to push messages and the client to indicate that the user is typing.

## HTTP API

There is one route:

* `/apiv2/messages`
  - GET: retrieve the last 50 messages, as JSON array (see Data Structures below)
  - POST: add a message, as a string with the content type `text/plain`

Authentication: to POST a message, the user must be authenticated with Google; the ID token is passed as a Bearer token in HTTP requests. An authenticated user's picture is used as the message picture url.

## Web Sockets API

The WS API lives at `/wsv1`; on opening a socket, the server sends the top-50 Ch@or messages in a web socket message like this:

```js
{
  type: 'allMessages',
  messages: // an array as described in Data Structures below
}
```

When the server receives a message (over the HTTP API), the WS API broadcasts the message to all connected clients, with a message like this:

```js
{
  type: 'message',
  message: // a single object as below in Data Structures
}
```

The API accepts messages to log in, and to indicate that a user is typing.

### Login

```js
{
  type: 'login'
  token: // id token from Google auth library
}
```

The client sends this message to associate an avatar (found in the token) with their connection and to be able to indicate typing.


### Indicating typing

```js
{
  type: 'typing'
}
```

The client sends this message to mean that a user is typing and the server notifies all its connected clients about all users who are typing, by sending a message like this:

```js
{
  type: 'typing',
  pictures: [], // array of strings, each is a URL of the typing user's avatar
}
```

## Data Structures

A list of messages is a JSON array of message objects with the following properties:

```js
{
  id,              // unique id
  message: string, // the text of the message
  url: string,     // url of the avatar picture to go with the message, if any
}
```
