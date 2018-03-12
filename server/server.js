'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const indexRoute = require('./routes/index.route');

const app = express();

app.use(bodyParser.json());
app.use('/', indexRoute);
app.use(express.static('./webpages'));

// starting server
app.listen(8080);
