require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const PORT = 3003;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/produits';

// Connexion à MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connecté à MongoDB pour le service des produits');
});

app.listen(PORT, () => {
  console.log(`Service des produits démarré sur le port ${PORT}`);
});

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);
