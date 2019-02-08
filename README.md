Ch@or: A little chat application
=======

Functionality:
* stores 50 messages
* first-in first-out (FIFO)
* first version in memory (no DB)

API:
* list the last up-to-50 messages
* submit a message
* a message is a string of up-to 281 characters
* see below

Management:
* this is managed in git
* source code hosted on GitHub (OBVS)

Deployment
* Google Cloud virtual machine with MariaDB
* `initdb.sql` creates the necessary database structure
  * **for those using pre-2019-02-01 versions, please use this to upgrade your DB:**
    `npm run updatedb-2019-02-01`
* set up `server/config.json` using the sample in `server/config-sample.json` with your credentials


API
-----

* /messages
  - GET: retrieve the last 50 messages
  - POST: add a message


Contributing
============
We welcome ideas and contributions of code.
* If you have ideas for features or enhancements, please:
  * _do_ [open an issue](../../issues/new)
  * _do_ use descriptive well-formed English language sentences to describe your idea rather than short bursts of words.
  * _do_ spell and grammar check your submission - help us avoid any unnecessary confusion.
  * _don't_ be offended if we can't use your idea immediately.
