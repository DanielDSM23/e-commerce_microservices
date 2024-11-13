const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const cartValidator = require('../validators/cartValidator');

router.post('/add', cartValidator.validateAddToCart, cartController.addToCart);

router.get('/:userId', cartValidator.validateGetCart, cartController.getCart);

router.delete('/remove', cartValidator.validateRemoveFromCart, cartController.removeFromCart);

router.put('/update', cartValidator.validateUpdateCartItem, cartController.updateCartItem);

module.exports = router;
