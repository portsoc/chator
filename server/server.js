'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// data

const data = [ 'first mess ever' ];

app.get('/messages', (req, res) => {
  res.json(data);
});

app.post('/messages', (req, res) => {
  data.unshift(req.body.value);
  if (data.length > 50) data.length = 50;
  res.json(data);
})

// static routes

app.use(express.static('./webpages'));

// starting server
app.listen(8080);
