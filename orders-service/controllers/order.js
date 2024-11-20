const OrderModel = require('../models/Order');
const { verifyUser } = require('../validator/order');
const axios = require('axios');

module.exports = {


    createCommand: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
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
                    price: response.data.items[i].productDetails.price,
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
            console.error(
                '[ORDER SERVICE] Order created'
            );
            res.status(201).json({ message: 'Order created successfully', order: savedOrder });

        } catch (error) {
            console.error(
                '[ORDER SERVICE] Error ', error.message
            );
            res.send({
                message: error.message
            });
        }
    },

    readCommand: async (req, res) => {
        try {
            const { orderId } = req.params;
            console.log(`[GET ORDER] Request received: commandId=${orderId}`);

            try {
                const order = await OrderModel.findById(orderId).populate('items.productId');
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
        const { orderId } = req.params;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid 'items' provided" });
        }

        try {

            const order = await OrderModel.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }


            const currentPrice = order.price;


            const newPrice = items.reduce((total, item) => {
                if (!item.productId || !item.quantity || !item.price) {
                    throw new Error('Each item must have productId, quantity, and price');
                }
                return total + item.quantity * item.price;
            }, 0);


            const refundAmount = currentPrice - newPrice;


            order.items = items;
            order.price = newPrice;
            order.updatedAt = new Date();


            const updatedOrder = await order.save();


            res.status(200).json({
                message: 'Order updated successfully',
                refundAmount: refundAmount > 0 ? refundAmount : 0, // Positive refund only
                additionalCharge: refundAmount < 0 ? Math.abs(refundAmount) : 0, // Positive charge if newPrice > currentPrice
                updatedOrder
            });
        } catch (error) {
            console.error('Error updating order:', error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
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
