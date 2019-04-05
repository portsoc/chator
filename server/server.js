'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const GoogleAuth = require('simple-google-openid');

const config = require('./config');

const app = express();

// enable WebSockets
const expressWS = require('express-ws')(app);

const apiv1 = require('./apiv1');
const apiv2 = require('./apiv2');
const wsv1 = require('./wsv1');

wsv1.setWss(expressWS.getWss());

app.use(bodyParser.json());

app.use(GoogleAuth(config.googleClientID));

// versions of the API
app.use(apiv1);
app.use('/v2', apiv2);
app.use('/wsv1', wsv1);

// static routes
app.use(express.static('./webpages'));

// starting server
app.listen(process.env.PORT || 8080);
