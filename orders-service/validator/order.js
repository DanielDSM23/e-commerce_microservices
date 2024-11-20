const { header, body, param, validationResult } = require('express-validator');

exports.validateCreateOrder = [
    header('User-Id')
        .notEmpty().withMessage('user-id est requis')
        .isMongoId().withMessage('user-id doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(`[VALIDATE CREATE ORDER] Validation errors: ${JSON.stringify(errors.array())} userId = ${req.headers['User-Id']}`);
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(`[VALIDATE CREATE ORDER] Validation passed: x-user-id=${req.headers['User-Id']}`);
        next();
    }
];

exports.validateGetOrder = [
    param('orderId')
        .notEmpty().withMessage('orderId est requis')
        .isMongoId().withMessage('orderId doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(`[VALIDATE GET ORDER] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(`[VALIDATE GET ORDER] Validation passed: orderId=${req.params.orderId}`);
        next();
    }
];

exports.validateUpdateOrder = [
    body('items')
        .isArray({ min: 1 }).withMessage('La commande doit contenir au moins un produit')
        .custom(items => {
            return items.every(item =>
                item.productId &&
                typeof item.productId === 'string' &&
                item.quantity &&
                Number.isInteger(item.quantity) && item.quantity > 0 &&
                item.price &&
                !isNaN(parseFloat(item.price)) && item.price > 0
            );
        }).withMessage('Chaque produit doit avoir un productId valide, une quantité positive et un prix valide'),

    body('items.*.productId')
        .notEmpty().withMessage('Chaque produit doit avoir un productId')
        .isMongoId().withMessage('productId doit être un identifiant valide'),

    body('items.*.quantity')
        .notEmpty().withMessage('Chaque produit doit avoir une quantité')
        .isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),

    body('items.*.price')
        .notEmpty().withMessage('Chaque produit doit avoir un prix')
        .isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(`[VALIDATE ITEMS] Erreurs de validation: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(`[VALIDATE ITEMS] Validation réussie: items=${JSON.stringify(req.body.items)}`);
        next();
    }
];

exports.validateRemoveOrder = [
    param('orderId')
        .notEmpty().withMessage('orderId est requis')
        .isMongoId().withMessage('orderId doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(`[VALIDATE REMOVE ORDER] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(`[VALIDATE REMOVE ORDER] Validation passed: orderId=${req.params.orderId}`);
        next();
    }
];
