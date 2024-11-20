const Cart = require('../models/Cart');
const pino = require('pino');
const logger = pino({ level: 'info' });

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.headers['x-user-id'];
    logger.info(`[ADD TO CART] Request received: userId=${userId}, productId=${productId}, quantity=${quantity}`);

    try {
        let cart = await Cart.findOne({ userId });
        logger.info(`[ADD TO CART] Cart found: ${cart}`);

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
            logger.info(`[ADD TO CART] New cart created: ${cart}`);
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            logger.info(`[ADD TO CART] Item index: ${itemIndex}`);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                logger.info(`[ADD TO CART] Updated item quantity: ${cart.items[itemIndex].quantity}`);
            } else {
                cart.items.push({ productId, quantity });
                logger.info(`[ADD TO CART] New item added to cart: ${productId}, quantity: ${quantity}`);
            }
        }
        
        cart.updatedAt = new Date();
        await cart.save();
        logger.info(`[ADD TO CART] Cart saved: ${cart}`);

        res.status(200).json({ message: 'Article ajouté au panier', cart });
    } catch (error) {
        logger.error(`[ADD TO CART] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de l\'ajout au panier', error });
    }
};

exports.getCart = async (req, res) => {
    const { userId } = req.params;
    logger.info(`[GET CART] Request received: userId=${userId}`);

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        logger.info(`[GET CART] Cart found: ${cart}`);

        if (!cart) {
            res.status(404).json({ message: 'Panier non trouvé' });
        } else {
            res.status(200).json(cart);
        }
    } catch (error) {
        logger.error(`[GET CART] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de la récupération du panier', error });
    }
};

exports.removeFromCart = async (req, res) => {
    const {productId} = req.body;
    const userId = req.headers['x-user-id'];
    logger.info('Reçu X-User-Id :', userId);
    logger.info(`[REMOVE FROM CART] Request received: userId=${userId}, productId=${productId}`);

    try {
        const cart = await Cart.findOne({ userId });
        logger.info(`[REMOVE FROM CART] Cart found: ${cart}`);

        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.updatedAt = new Date();
        await cart.save();
        logger.info(`[REMOVE FROM CART] Cart updated: ${cart}`);

        res.status(200).json({ message: 'Article retiré du panier', cart });
    } catch (error) {
        logger.error(`[REMOVE FROM CART] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'article du panier', error });
    }
};

exports.updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.headers['x-user-id'];
    logger.info(`[UPDATE CART ITEM] Request received: userId=${userId}, productId=${productId}, quantity=${quantity}`);

    try {
        const cart = await Cart.findOne({ userId });
        logger.info(`[UPDATE CART ITEM] Cart found: ${cart}`);

        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            logger.info(`[UPDATE CART ITEM] Updated item quantity: ${cart.items[itemIndex].quantity}`);
        } else {
            logger.error(`[UPDATE CART ITEM] Article non trouvé dans le panier`);
            return res.status(404).json({ message: 'Article non trouvé dans le panier' });
        }

        cart.updatedAt = new Date();
        await cart.save();
        logger.info(`[UPDATE CART ITEM] Cart updated: ${cart}`);

        res.status(200).json({ message: 'Quantité de l\'article mise à jour', cart });
    } catch (error) {
        logger.error(`[UPDATE CART ITEM] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article du panier', error });
    }
};