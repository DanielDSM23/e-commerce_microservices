const express = require('express');
const router = require('express').Router();
const orderController = require('../controllers/order');
const orderValidator = require('../validator/order');

router.post('/add', orderValidator.validateCreateOrder, orderController.createCommand);

router.get('/:orderId', orderValidator.validateGetOrder, orderController.readCommand);

router.delete('/remove', orderValidator.validateRemoveOrder, orderController.deleteCommand);

router.put('/update', orderValidator.validateUpdateOrder, orderController.updateCommand);

module.exports = router;
