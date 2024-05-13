const app = require('express')();
const httpProxy = require('express-http-proxy');
var http = require('http');
var logger = require('morgan');
const port = 3001;
const express = require('express')
const helmet = require('helmet');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const orquestradorServiceProxy = httpProxy(process.env.ORQUESTRADOR_API);

// CLIENTES

app.post(`/api/orq/cadastro`, (req, res, next) => orquestradorServiceProxy(req, res, next));


// PUBLICACAO
app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

var server = http.createServer(app);
server.listen(port);