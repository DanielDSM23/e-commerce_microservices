const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes');
const pino = require('pino');
const logger = pino({ level: 'info' });

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

mongoose.connect("mongodb://root:example@mongo-cart:27017")
.then(() => logger.info('[CART-SERVICE] Connexion à MongoDB réussie'))
  .catch(err => logger.error('[CART-SERVICE] Erreur de connexion à MongoDB:', err));

app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
    logger.info(`[CART-SERVICE] Serveur en cours d'exécution sur le port ${PORT}`);
});