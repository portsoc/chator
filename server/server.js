'use strict';

const express = require('express');
const app = express();

// static routes

app.use(express.static('./webpages'));

// starting server
app.listen(8080);
