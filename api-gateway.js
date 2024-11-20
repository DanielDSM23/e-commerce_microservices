require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

// Middleware pour vérifier le JWT
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

// Middleware de journalisation
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Route pour le service d'authentification
app.use(
  '/auth',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    pathRewrite: {
      '': '/api/auth',
    },
  })
);

// Route pour le service de commande
app.use(
    '/order',
    verifyJWT,
    (req, res, next) => {
      if (req.user && req.user.userId) {
        req.headers['user-id'] = req.user.userId;
        req.headers['token'] = req.headers['authorization'].split(' ')[1];
        console.log(
            '[API-GATEWAY ORDER PROXY] Sending User-Id to order service:',
            req.user.userId
        );
      } else {
        console.error(
            '[API-GATEWAY ORDER PROXY] User ID not found in req.user'
        );
      }
      next();
    },
    createProxyMiddleware({
      target: process.env.ORDER_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        '': '/api/order',
      },
    })
);


// Route pour le service produit
app.use(
  '/products',
  verifyJWT,
  (req, res, next) => {
    if (req.user && req.user.userId) {
      req.headers['User-Id'] = req.user.userId;
      req.headers['token'] = req.headers['authorization'].split(' ')[1];
      console.log(
        '[API-GATEWAY PRODUCT PROXY] Sending User-Id to product service:',
        req.user.userId
      );
    } else {
      console.error(
        '[API-GATEWAY PRODUCT PROXY] User ID not found in req.user'
      );
    }
    next();
  },
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '': '/products', // Réécrit l'URL pour qu'elle corresponde à celle du service produit
    },
  })
);

// Route pour tester le JWT
app.get('/test-jwt', verifyJWT, (req, res) => {
  res.json({
    message: 'Le JWT est valide',
    user: req.user.userId,
  });
});

// Route pour le panier
app.use('/cart', verifyJWT, cartRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
