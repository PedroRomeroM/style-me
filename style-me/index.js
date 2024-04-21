const express = require('express');
const app = express();
const httpProxy = require('express-http-proxy');
const http = require('http');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer'); // Importe o multer
require('dotenv').config();
var httpProxy1 = require('http-proxy');


const port = 3001;  
const userServiceProxy = httpProxy(process.env.REACT_APP_API_GATEWAY);

var apiProxy = httpProxy1.createProxyServer();

// Configuração do multer
const upload = multer();

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}));
app.use(logger('combined'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Adicione o middleware multer para processar os dados do formulário
app.use(upload.any()); // Isso irá processar qualquer tipo de formulário multipart

app.post('/api/user', (req, res, next) => {
  console.log('Recebendo solicitação POST para /api/user:');
  console.log('Corpo da solicitação:', req.body); // Verifica o corpo da solicitação
  console.log('Arquivos:', req.files); // Verifica os arquivos enviados (se houver)
  console.log('Cabeçalhos:', req.headers); // Verifica os cabeçalhos da solicitação
  userServiceProxy(req, res, next);
});


var server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
