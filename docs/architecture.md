# System Architecture of Ch@or

The system is a web app so it has a client side and a server side. They communicate with an API over HTTP or WebSockets, as described in `api.md`.

## Client side

The client is very simply, only three files, all located in `webpages/`:

* `index.html` contains google auth button and a placeholder for the chat messages under id `messages`
* `chator.js` is all the client-side code, with these main functions:
  - `connectWS` to connect to the web sockets API
  - `loadMessages` to get all messages from the HTTP API when web sockets are not available
  - `fillMessages` puts received messages into the page
  - `addMessage` sends a new message typed by the user to the HTTP API
* `css/style.css` has all the styling

## Server side

All files are in `server/`

* `server.js` is the main entry point, it serves the static pages from `webpages/` and the API
* `apiv2.js` is the current implementation of the HTTP API
* `wsv1.js` is the web-sockets API
* `db.js` is the database module that supports the API modules above
* `apiv1.js` is an old API implementation that is kept to support remaining outdated Ch@or clients
* `config-sample.json` needs to be copied into `config.json` to provide runtime parameters such as where to find the database and what the Google client ID is
* `util.js` tool and utility functions

_It would be nice to have a diagram of the (main) dependencies here._

## Further considerations

* `webpages/chator.js` might be split into several modules (at least web-socket handling should be separable)
* `server/apiv1.js`, if kept around, should use the `db.js` module
* database setup files should not be in the root folder
