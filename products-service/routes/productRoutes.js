const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Ajouter un nouveau produit
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['user-id']; // Récupération de l'userId depuis les en-têtes
    if (!userId) {
      return res.status(400).json({ message: 'User-Id manquant dans les en-têtes' });
    }

    console.log(`User-Id reçu pour la création de produit : ${userId}`);
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour un produit par ID
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id']; // Récupération de l'userId depuis les en-têtes
    if (!userId) {
      return res.status(400).json({ message: 'User-Id manquant dans les en-têtes' });
    }

    console.log(`User-Id reçu pour la mise à jour de produit : ${userId}`);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un produit par ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['user-id']; // Récupération de l'userId depuis les en-têtes
    if (!userId) {
      return res.status(400).json({ message: 'User-Id manquant dans les en-têtes' });
    }

    console.log(`User-Id reçu pour la suppression de produit : ${userId}`);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
