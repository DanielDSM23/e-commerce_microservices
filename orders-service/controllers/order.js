const OrderModel = require('../models/Order');
const { verifyUser } = require('../validator/order');
const axios = require('axios');

module.exports = {


    createCommand: async (req, res) => {
        try {
            console.log(' ORDER SERVICE Headers sent to downstream service:', req.headers);

            const userId = req.headers['user-id'];
            console.log("USER ID =  ", userId)
            const token = req.headers['token'];
            const response = await axios.get(`${process.env.CART_SERVICE_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let items = [];
            let totalPrice = 0;
            for(let i = 0; i<response.data.items.length; i++){
                items.push({
                    productId : response.data.items[i].productId,
                    quantity : response.data.items[i].quantity,
                })
                totalPrice+= +response.data.items[i].quantity * +response.data.items[i].productDetails.price
            }

            const orderData = {
                userId: userId,
                items: items,
                price: totalPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            console.log(orderData);
            const order = new OrderModel(orderData);
            const savedOrder = await order.save();
            res.status(201).json({ message: 'Order created successfully', order: savedOrder });

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
            const { orderId } = req.params;
            const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

            if (!deletedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            //payement service refund///
            return res.status(200).json({ message: 'Order successfully deleted', orderId });
        } catch (error) {
            console.error('Error deleting order:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }


    }
};
