const express = require('express');
const http = require('http');
const httpProxy = require('express-http-proxy');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors({origin: 'http://localhost:3000'}));

const tokenExpirationMin = 30; // Quantos minutos para o token expirar

const orquestradorServiceProxy = httpProxy(process.env.ORQUESTRADOR_API);

// JWT
const jwtServiceProxy = httpProxy(process.env.AUTH_API + '/auth/login', {
  function(res) { return res },
  proxyReqOptDecorator: function (proxyReqOpts) {
    // Alteração do header
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.method = 'POST';
    return proxyReqOpts;
  },
  userResDecorator: function (proxyRes, proxyResData, _userReq, userRes) {
    // Processamento do token
    if (proxyRes.statusCode === 200) {
      try {
        const str = Buffer.from(proxyResData).toString('utf-8');
        const objBody = JSON.parse(str);
        if (!objBody.email) {
          throw new Error('Email is missing in response body');
        }

        const token = jwt.sign({ id: objBody.id, tipoUser: objBody.tipoUser, email: objBody.email }, '8morss2f135mor*5', {
          expiresIn: 1440, // Define o tempo de expiração do token
        });

        userRes.status(200);
        return { auth: true, token: token };

      } catch (e) {
        console.error(' - ERRO: ', e);
        return userRes.status(500).json({ message: 'Internal server error' });
      }
    } else {
      return userRes.status(401).json({ message: 'Login inválido!' });

    }
  },
});

function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
  }

  jwt.verify(token, '8morss2f135mor*5', (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token.' });
    }

    // se tudo estiver ok, salva no request para uso posterior
    let infoUser = { "id": decoded.id, "tipoUser": decoded.tipoUser, "email": decoded.email }
    req.infoUser = infoUser
    next();
  });
}

// ORQUESTRADOR
app.post('/api/orq/cadastro', (req, res, next) => orquestradorServiceProxy(req, res, next));

// AUTH
app.post('/api/auth/login', async (req, res, next) => { jwtServiceProxy(req, res, next); });

app.get(`/api/user`, verifyJWT, async (req, res) => {
  let jwtInfo = req.infoUser

  const response = await axios.get(`http://localhost:8081/api/user/${jwtInfo.id}`)

  let email = jwtInfo.email;

  response.data.email = email;

  res.send(response.data);

});


// DESAFIOS
app.get(`/api/ch`, verifyJWT, async (req, res) => {
  let jwtInfo = req.infoUser

  const response = await axios.get(`http://localhost:8083/api/ch/${jwtInfo.id}`)

  res.send(response.data);

});


// Configuração da aplicação
app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});