const express = require('express');
const app = express();
const httpProxy = require('express-http-proxy');
const http = require('http');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const port = 3000;  
const userServiceProxy = httpProxy(process.env.REACT_APP_API_GATEWAY);

app.use(logger('combined'));
app.use(cors({
  origin: 'http://localhost:3001',  
  optionsSuccessStatus: 200 
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post(`/user`, (req, res, next) => userServiceProxy(req, res, next));

var server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
