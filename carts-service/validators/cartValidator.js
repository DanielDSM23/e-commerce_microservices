const { body, param, validationResult } = require('express-validator');
const pino = require('pino');
const logger = pino({ level: 'info' });

exports.validateAddToCart = [
    body('productId')
        .notEmpty().withMessage('productId est requis')
        .isMongoId().withMessage('productId doit être un identifiant valide'),
    body('quantity')
        .notEmpty().withMessage('La quantité est requise')
        .isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE ADD TO CART] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE ADD TO CART] Validation passed: userId=${req.body.userId}, productId=${req.body.productId}, quantity=${req.body.quantity}`);
        next();
    }
];

exports.validateGetCart = [
    param('userId')
        .notEmpty().withMessage('userId est requis')
        .isMongoId().withMessage('userId doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE GET CART] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE GET CART] Validation passed: userId=${req.params.userId}`);
        next();
    }
];

exports.validateRemoveFromCart = [
    body('productId')
        .notEmpty().withMessage('productId est requis')
        .isMongoId().withMessage('productId doit être un identifiant valide'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE REMOVE FROM CART] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE REMOVE FROM CART] Validation passed: userId=${req.body.userId}, productId=${req.body.productId}`);
        next();
    }
];

exports.validateUpdateCartItem = [
    body('productId')
        .notEmpty().withMessage('productId est requis')
        .isMongoId().withMessage('productId doit être un identifiant valide'),
    body('quantity')
        .notEmpty().withMessage('La quantité est requise')
        .isInt({ min: 1 }).withMessage('La quantité doit être un entier positif'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`[VALIDATE UPDATE CART ITEM] Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(`[VALIDATE UPDATE CART ITEM] Validation passed: userId=${req.body.userId}, productId=${req.body.productId}, quantity=${req.body.quantity}`);
        next();
    }
];