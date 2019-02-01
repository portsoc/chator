'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const GoogleAuth = require('simple-google-openid');

const apiv1 = require('./apiv1');
const apiv2 = require('./apiv2');

const app = express();
app.use(bodyParser.json());

app.use(GoogleAuth('1010342411950-ulstr9hnl2uqrlth7pu94ic0h9eqlfb9.apps.googleusercontent.com'));

// versions of the API
app.use(apiv1);
app.use('/v2', apiv2);

// static routes
app.use(express.static('./webpages'));

// starting server
app.listen(8080);
