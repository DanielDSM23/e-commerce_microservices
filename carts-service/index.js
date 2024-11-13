const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

mongoose.connect("mongodb://root:example@mongo:27017/")
.then(() => console.log('[CART-SERVICE] Connexion à MongoDB réussie'))
  .catch(err => console.error('[CART-SERVICE] Erreur de connexion à MongoDB:', err));

app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
    console.log(`[CART-SERVICE] Serveur en cours d'exécution sur le port ${PORT}`);
});