require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

app.use('/auth', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  pathRewrite: {
    '': '/api/auth/',
  },
}));





app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
