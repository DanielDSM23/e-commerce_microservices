const OrderModel = require('../models/Order');
const { verifyUser } = require('../validator/order');
const axios = require('axios');

module.exports = {


    createCommand: async (req, res) => {
        try {
            const userId = req.headers['User-Id'];
            const token = req.headers['token'];
            const response = await axios.get(`${process.env.CART_SERVICE_URL}/cart/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // Set the Bearer token in the Authorization header
                }
            });

            const products = response.data;
            res.send(products);
        } catch (error) {
            res.send({
                message: error.message
            });
        }
    },

    readCommand: async (req, res) => {
        try {
            const { commandId } = req.params;
            console.log(`[GET ORDER] Request received: commandId=${commandId}`);

            try {
                const order = await OrderModel.find({ id: commandId }).populate('items.productId');
                console.log(`[GET ORDER] Order found: ${order}`);

                if (!order) {
                    res.status(404).json({ message: 'Commande non trouvé' });
                } else {
                    res.status(200).json(order);
                }
            } catch (error) {
                console.error(`[GET ORDER] Error: ${error}`);
                res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error });
            }
        } catch (error) {
            res.send({
                message: error.message
            });
        }
    },


    updateCommand: async (req, res) => {
        try {

        } catch (error){

        }


    },


    deleteCommand: async (req, res) => {
        try {

        } catch (error){

        }


    }
};
