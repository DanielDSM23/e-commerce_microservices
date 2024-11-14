const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log(`[ADD TO CART] Request received: userId=${userId}, productId=${productId}, quantity=${quantity}`);

    try {
        let cart = await Cart.findOne({ userId });
        console.log(`[ADD TO CART] Cart found: ${cart}`);

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
            console.log(`[ADD TO CART] New cart created: ${cart}`);
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            console.log(`[ADD TO CART] Item index: ${itemIndex}`);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                console.log(`[ADD TO CART] Updated item quantity: ${cart.items[itemIndex].quantity}`);
            } else {
                cart.items.push({ productId, quantity });
                console.log(`[ADD TO CART] New item added to cart: ${productId}, quantity: ${quantity}`);
            }
        }
        
        cart.updatedAt = new Date();
        await cart.save();
        console.log(`[ADD TO CART] Cart saved: ${cart}`);

        res.status(200).json({ message: 'Article ajouté au panier', cart });
    } catch (error) {
        console.error(`[ADD TO CART] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de l\'ajout au panier', error });
    }
};

exports.getCart = async (req, res) => {
    const { userId } = req.params;
    console.log(`[GET CART] Request received: userId=${userId}`);

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        console.log(`[GET CART] Cart found: ${cart}`);

        if (!cart) {
            res.status(404).json({ message: 'Panier non trouvé' });
        } else {
            res.status(200).json(cart);
        }
    } catch (error) {
        console.error(`[GET CART] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de la récupération du panier', error });
    }
};

exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    console.log(`[REMOVE FROM CART] Request received: userId=${userId}, productId=${productId}`);

    try {
        const cart = await Cart.findOne({ userId });
        console.log(`[REMOVE FROM CART] Cart found: ${cart}`);

        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.updatedAt = new Date();
        await cart.save();
        console.log(`[REMOVE FROM CART] Cart updated: ${cart}`);

        res.status(200).json({ message: 'Article retiré du panier', cart });
    } catch (error) {
        console.error(`[REMOVE FROM CART] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'article du panier', error });
    }
};

exports.updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log(`[UPDATE CART ITEM] Request received: userId=${userId}, productId=${productId}, quantity=${quantity}`);

    try {
        const cart = await Cart.findOne({ userId });
        console.log(`[UPDATE CART ITEM] Cart found: ${cart}`);

        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        console.log(`[UPDATE CART ITEM] Item index: ${itemIndex}`);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            console.log(`[UPDATE CART ITEM] Updated item quantity: ${cart.items[itemIndex].quantity}`);
        } else {
            return res.status(404).json({ message: 'Article non trouvé dans le panier' });
        }

        cart.updatedAt = new Date();
        await cart.save();
        console.log(`[UPDATE CART ITEM] Cart updated: ${cart}`);

        res.status(200).json({ message: 'Quantité de l\'article mise à jour', cart });
    } catch (error) {
        console.error(`[UPDATE CART ITEM] Error: ${error}`);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article du panier', error });
    }
};