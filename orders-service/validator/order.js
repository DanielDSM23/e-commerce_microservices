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
    param('orderId')
        .notEmpty().withMessage('orderId est requis')
        .isMongoId().withMessage('orderId doit être un identifiant valide'),
    body('products')
        .isArray({ min: 1 }).withMessage('La commande doit contenir au moins un produit')
        .custom(products => {
            return products.every(product =>
                product.productId &&
                typeof product.productId === 'string' &&
                product.quantity &&
                Number.isInteger(product.quantity) &&
                product.quantity > 0 &&
                product.price &&
                !isNaN(parseFloat(product.price))
            );
        }).withMessage('Chaque produit doit avoir un productId valide, une quantité positive et un prix valide'),
    body('products.*.productId')
        .notEmpty().withMessage('Chaque produit doit avoir un productId')
        .isMongoId().withMessage('productId doit être un identifiant valide'),
    body('products.*.quantity')
        .notEmpty().withMessage('Chaque produit doit avoir une quantité')
        .isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),
    body('products.*.price')
        .notEmpty().withMessage('Chaque produit doit avoir un prix')
        .isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(`[VALIDATE UPDATE ORDER] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(`[VALIDATE UPDATE ORDER] Validation passed: orderId=${req.params.orderId}, products=${JSON.stringify(req.body.products)}`);
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
