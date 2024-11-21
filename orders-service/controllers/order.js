const OrderModel = require('../models/Order');
const { verifyUser } = require('../validator/order');
let axios = require('axios');
axios = axios.create({
    timeout: 2000
});
const pino = require('pino');
const logger = pino({ level: 'info' });

module.exports = {

    createCommand: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            const token = req.headers['token'];

            logger.info('[ORDER SERVICE] Request to create order received.');

            const response = await axios.get(`${process.env.CART_SERVICE_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let items = [];
            let totalPrice = 0;
            for (let i = 0; i < response.data.items.length; i++) {
                items.push({
                    productId: response.data.items[i].productId,
                    quantity: response.data.items[i].quantity,
                    price: response.data.items[i].productDetails.price,
                });
                totalPrice += +response.data.items[i].quantity * +response.data.items[i].productDetails.price;
            }

            const orderData = {
                userId: userId,
                items: items,
                price: totalPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            logger.info(`[ORDER SERVICE] Order data: ${JSON.stringify(orderData)}`);
            const order = new OrderModel(orderData);
            const savedOrder = await order.save();

            logger.info('[ORDER SERVICE] Order created successfully.');
            res.status(201).json({ message: 'Order created successfully', order: savedOrder });

        } catch (error) {
            logger.error(`[ORDER SERVICE] Error creating order: ${error.message}`);
            res.send({ message: error.message });
        }
    },

    readCommand: async (req, res) => {
        try {
            const { orderId } = req.params;
            logger.info(`[ORDER SERVICE] Request to fetch order with ID: ${orderId}`);

            const order = await OrderModel.findById(orderId).populate('items.productId');

            if (!order) {
                logger.error(`[ORDER SERVICE] Order with ID ${orderId} not found.`);
                return res.status(404).json({ message: 'Commande non trouvé' });
            }

            logger.info(`[ORDER SERVICE] Order found: ${JSON.stringify(order)}`);
            res.status(200).json(order);

        } catch (error) {
            logger.error(`[ORDER SERVICE] Error fetching order: ${error.message}`);
            res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error });
        }
    },

    updateCommand: async (req, res) => {
        const { orderId } = req.params;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            logger.error('[ORDER SERVICE] Invalid "items" provided in update request.');
            return res.status(400).json({ message: "Invalid 'items' provided" });
        }

        try {
            const order = await OrderModel.findById(orderId);
            if (!order) {
                logger.error(`[ORDER SERVICE] Order with ID ${orderId} not found.`);
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

            logger.info(`[ORDER SERVICE] Order updated successfully. Refund Amount: ${refundAmount > 0 ? refundAmount : 0}, Additional Charge: ${refundAmount < 0 ? Math.abs(refundAmount) : 0}`);

            res.status(200).json({
                message: 'Order updated successfully',
                refundAmount: refundAmount > 0 ? refundAmount : 0,
                additionalCharge: refundAmount < 0 ? Math.abs(refundAmount) : 0,
                updatedOrder
            });
        } catch (error) {
            logger.error(`[ORDER SERVICE] Error updating order: ${error.message}`);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    deleteCommand: async (req, res) => {
        try {
            const { orderId } = req.params;
            const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

            if (!deletedOrder) {
                logger.error(`[ORDER SERVICE] Order with ID ${orderId} not found for deletion.`);
                return res.status(404).json({ message: 'Order not found' });
            }

            logger.info(`[ORDER SERVICE] Order with ID ${orderId} successfully deleted.`);
            return res.status(200).json({ message: 'Order successfully deleted', orderId });

        } catch (error) {
            logger.error(`[ORDER SERVICE] Error deleting order: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
