const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const rootRouter = require('./routes/root');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);

module.exports = app;
