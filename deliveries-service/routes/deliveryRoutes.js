const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const deliveryValidator = require('../validators/deliveryValidator');

router.post('/add', deliveryValidator.validateAddToDelivery, deliveryController.addToDelivery);

router.get('/:orderId', deliveryValidator.validateGetDelivery, deliveryController.getDelivery);

router.delete('/remove/:orderId', deliveryValidator.validateRemoveFromDelivery, deliveryController.removeFromDelivery);

router.put('/update/:orderId', deliveryValidator.validateUpdateDelivery, deliveryController.updateDelivery);

module.exports = router;