const express = require('express');
let axios = require('axios');
axios = axios.create({
  timeout: 2000
})
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const router = express.Router();
const CART_SERVICE_URL = process.env.CART_SERVICE_URL;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const cartResponse = await axios.get(`${CART_SERVICE_URL}api/cart/${req.user.userId}`);
    const cart = cartResponse.data;
    const productDetails = await Promise.all(
      cart.items.map(item =>
        axios.get(`${PRODUCT_SERVICE_URL}products/${item.productId}`).then(res => res.data)
      )
    );
    cart.items = cart.items.map((item, index) => ({
      ...item,
      productDetails: productDetails[index]
    }));
    res.send(cart);
    } catch (error) {
      console.error(`[API Gateway] Error fetching cart: ${error.message}`);
      res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
});
  
  router.delete('/remove', createProxyMiddleware({
    target: CART_SERVICE_URL,
    pathRewrite: {
      '^/remove': '/api/cart/remove',
    },
    changeOrigin: true,
    onError: (err, req, res, target) => {
      res.writeHead(500, {
          'Content-Type': 'application/json',
      });
      res.end({ message: 'Something went wrong on proxy request. Please retry.' });
    },
    on: { 
      proxyReq: (proxyReq, req, res) => {
      console.log('[onProxyReq] Triggered');
      proxyReq.setHeader('X-User-Id', req.user.userId);
    }
  }
  }));
  
  router.put('/update', createProxyMiddleware({
    target: CART_SERVICE_URL,
    pathRewrite: {
      '^/update': '/api/cart/update',
    },
    changeOrigin: true,
    on: { 
      proxyReq: (proxyReq, req, res) => {
      console.log('[onProxyReq] Triggered');
      proxyReq.setHeader('X-User-Id', req.user.userId);
    }
  }
  }));
  
  router.post('/add', createProxyMiddleware({
    target: CART_SERVICE_URL,
    pathRewrite: {
      '^/add': '/api/cart/add',
    },
    changeOrigin: true,
    on: { 
      proxyReq: (proxyReq, req, res) => {
      console.log('[onProxyReq] Triggered');
      proxyReq.setHeader('X-User-Id', req.user.userId);
    }
  }
  }));

  module.exports = router;