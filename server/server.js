'use strict';

const express = require('express');
const app = express();

// data

const data = [ 'first mess ever' ];

app.get('/messages', (req, res) => {
  res.json(data);
});

// static routes

app.use(express.static('./webpages'));

// starting server
app.listen(8080);
