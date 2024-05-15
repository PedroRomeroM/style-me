const express = require('express');
const http = require('http');
const httpProxy = require('express-http-proxy');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3001;

const tokenExpirationMin = 30; // Quantos minutos para o token expirar

const orquestradorServiceProxy = httpProxy(process.env.ORQUESTRADOR_API);
const authServiceProxy = httpProxy(process.env.AUTH_API);
const userServiceProxy = httpProxy(process.env.USER_API);

// JWT
const jwtServiceProxy = httpProxy(process.env.AUTH_API + '/auth/login', {
  function (res) { return res},
  proxyReqOptDecorator: function (proxyReqOpts) {
    // Alteração do header
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.method = 'POST';
    return proxyReqOpts;
  },
  userResDecorator: function (proxyRes, proxyResData, _userReq, userRes) {
    // Processamento do token
    console.log(proxyRes.statusCode)
    if (proxyRes.statusCode === 200) {
      try {
        const str = Buffer.from(proxyResData).toString('utf-8');
        const objBody = JSON.parse(str);

        console.log(objBody.id)

        if (!objBody.email) {
          throw new Error('Email is missing in response body');
        }

        const token = jwt.sign({ id: objBody.id, tipoUser: objBody.tipoUser, email: objBody.senha }, '8morss2f135mor*5', {
          expiresIn: tokenExpirationMin * 600, // Define o tempo de expiração do token
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
    let infoUser = {"id":decoded.id, "tipoUser":decoded.tipoUser}
    req.infoUser = infoUser
    next();
  });
}

// ORQUESTRADOR
app.post('/api/orq/cadastro', (req, res, next) => orquestradorServiceProxy(req, res, next));

// AUTH
app.post('/api/auth/login', (req, res, next) => jwtServiceProxy(req, res, next));

// USER
// app.get('/api/user/:id', (req, res, next) => userServiceProxy(req, res, next));

app.get(`/api/user`, verifyJWT, (req, res, next) => {
    httpProxy('http://localhost:8081/api/user/' + `/${req.query.id}`, {
      userResDecorator: function (proxyRes, proxyResData, _userReq, userRes) {
        if (proxyRes.statusCode == 200) {
          var str = Buffer.from(proxyResData).toString('utf-8');
          userRes.status(200);
          console.log(str)
          return str;
        } else {
          userRes.status(proxyRes.statusCode);
          return { message: 'Um erro ocorreu ao buscar o user.' };
        }
      },
    })(req, res, next);
  });

  app.post(`/test`, (req, res) => {
    const token = jwt.sign({ id: 1, tipoUser: 'ADM', email: 'teste@teste' }, '8morss2f135mor*5', {
      expiresIn: tokenExpirationMin * 600, // Define o tempo de expiração do token
    });
    res.status(200);
    res.send({ auth: true, token: token});
  });

  app.get(`/test`, verifyJWT, (req, res) => {
    let jwtInfo = req.infoUser
    console.log("Obj dentro do JWT: " + jwtInfo.id + " " + jwtInfo.tipoUser)
    res.send('resposta: ' + JSON.stringify(jwtInfo))
  });

// Configuração da aplicação
app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});