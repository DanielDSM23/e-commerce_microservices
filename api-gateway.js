require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';


const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalide' });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Token manquant' });
  }
};



app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

app.use('/auth', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  pathRewrite: {
    '': '/api/auth',
  },
}));

/*app.use('/command', verifyJWT, createProxyMiddleware({
  target: process.env.PROTECTED_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/': '',
  },
  onProxyReq: (proxyReq, req) => {
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id);
      proxyReq.setHeader('X-User-Role', req.user.role);
    }
  },
}));*/
app.get('/test-jwt', verifyJWT, (req, res) => {
  res.json({
    message: 'Le JWT est valide',
    user: req.user,
  });
});

app.use('/cart', verifyJWT, cartRoutes);



app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
