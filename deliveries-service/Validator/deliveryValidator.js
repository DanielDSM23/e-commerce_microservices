const { body, param, validationResult } = require('express-validator');
const pino = require('pino');
const logger = pino({ level: 'info' });

exports.validateAddToDelivery = [
    body('orderId')
        .notEmpty().withMessage('orderId est requis')
        .isMongoId().withMessage('orderId doit être un identifiant valide'),
    body('shippingAddress')
        .notEmpty().withMessage('L\'adresse de livraison est requise')
        .isString().withMessage('L\'adresse de livraison doit être une chaîne de caractères valide'),
    body('trackingNumber')
        .notEmpty().withMessage('Le numéro de suivi est requis')
        .isString().withMessage('Le numéro de suivi doit être une chaîne de caractères valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE ADD TO DELIVERY] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE ADD TO DELIVERY] Validation passed: orderId=${req.body.orderId}, trackingNumber=${req.body.trackingNumber}`);
        next();
    }
];

exports.validateGetDelivery = [
    param('orderId')
        .notEmpty().withMessage('orderId est requis')
        .isMongoId().withMessage('orderId doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE GET DELIVERY] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE GET DELIVERY] Validation passed: orderId=${req.params.orderId}`);
        next();
    }
];

exports.validateRemoveFromDelivery = [
    param('orderId')
        .notEmpty().withMessage('orderId est requis')
        .isMongoId().withMessage('orderId doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE REMOVE FROM DELIVERY] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE REMOVE FROM DELIVERY] Validation passed: orderId=${req.params.orderId}`);
        next();
    }
];

exports.validateUpdateDelivery = [
    body('shippingAddress')
        .optional()
        .isString().withMessage('L\'adresse de livraison doit être une chaîne de caractères valide'),
    body('deliveryStatus')
        .optional()
        .isIn(['pending', 'in-transit', 'delivered']).withMessage('Le statut de livraison doit être "pending", "in-transit", ou "delivered"'),
    body('trackingNumber')
        .optional()
        .isString().withMessage('Le numéro de suivi doit être une chaîne de caractères valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE UPDATE DELIVERY] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE UPDATE DELIVERY] Validation passed: body=${JSON.stringify(req.body)}`);
        next();
    }
];
