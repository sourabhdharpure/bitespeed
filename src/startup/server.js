'use strict';
// List all required modules first
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./mysql');


const PORT = 4000;


const router = require('../router');

const app = express();
const httpServer = require('http').createServer(app);

/* Application wide configurations */
app.enable('strict routing');
// app.enable('case sensitive routing');
app.enable('trust proxy');
app.set('etag', 'strong');

app.use(cookieParser());
/* Securing against known vulnerabilities. */
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000,
}));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.static('public'));

app.options('*', cors());
app.use(cors());



app.use(router);
db.connect(null, (err) => {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1);
  } else {

    httpServer.listen(PORT, async () => {
      console.log(`App listening started on port ${PORT}`);
    });
  }
});

module.exports = {
  app,
  httpServer,
};

