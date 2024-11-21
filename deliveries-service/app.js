require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/deliveries', deliveryRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Deliveries service running on port ${PORT}`));
