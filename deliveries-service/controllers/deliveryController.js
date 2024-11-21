const Delivery = require('../models/Delivery');
const pino = require('pino');
const logger = pino({ level: 'info' });

exports.addToDelivery = async (req, res) => {
    const { orderId, shippingAddress, deliveryDate, trackingNumber } = req.body;

    logger.info(`[DELIVERY SERVICE] Adding delivery for orderId: ${orderId}`);

    try {
        const existingDelivery = await Delivery.findOne({ orderId });

        if (existingDelivery) {
            logger.error(`[DELIVERY SERVICE] Delivery already exists for orderId: ${orderId}`);
            return res.status(400).json({ message: 'Delivery already exists for this order' });
        }

        const delivery = new Delivery({
            orderId,
            shippingAddress,
            deliveryDate,
            trackingNumber,
            deliveryStatus: 'pending',
        });

        const savedDelivery = await delivery.save();

        logger.info(`[DELIVERY SERVICE] Delivery created successfully: ${JSON.stringify(savedDelivery)}`);
        res.status(201).json({ message: 'Delivery added successfully', delivery: savedDelivery });
    } catch (error) {
        logger.error(`[DELIVERY SERVICE] Error adding delivery: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.getDelivery = async (req, res) => {
    const { orderId } = req.params;

    logger.info(`[DELIVERY SERVICE] Fetching delivery for orderId: ${orderId}`);

    try {
        const delivery = await Delivery.findOne({ orderId });

        if (!delivery) {
            logger.error(`[DELIVERY SERVICE] Delivery not found for orderId: ${orderId}`);
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.status(200).json(delivery);
    } catch (error) {
        logger.error(`[DELIVERY SERVICE] Error fetching delivery: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.removeFromDelivery = async (req, res) => {
    const { orderId } = req.params;

    logger.info(`[DELIVERY SERVICE] Removing delivery for orderId: ${orderId}`);

    try {
        const deletedDelivery = await Delivery.findOneAndDelete({ orderId });

        if (!deletedDelivery) {
            logger.error(`[DELIVERY SERVICE] Delivery not found for orderId: ${orderId}`);
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.status(200).json({ message: 'Delivery removed successfully', orderId });
    } catch (error) {
        logger.error(`[DELIVERY SERVICE] Error removing delivery: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.updateDelivery = async (req, res) => {
    const { orderId } = req.params;
    const { shippingAddress, deliveryDate, deliveryStatus, trackingNumber } = req.body;

    logger.info(`[DELIVERY SERVICE] Updating delivery for orderId: ${orderId}`);

    try {
        const delivery = await Delivery.findOne({ orderId });

        if (!delivery) {
            logger.error(`[DELIVERY SERVICE] Delivery not found for orderId: ${orderId}`);
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (shippingAddress) delivery.shippingAddress = shippingAddress;
        if (deliveryDate) delivery.deliveryDate = deliveryDate;
        if (deliveryStatus) delivery.deliveryStatus = deliveryStatus;
        if (trackingNumber) delivery.trackingNumber = trackingNumber;

        delivery.updatedAt = new Date();
        const updatedDelivery = await delivery.save();

        logger.info(`[DELIVERY SERVICE] Delivery updated successfully: ${JSON.stringify(updatedDelivery)}`);
        res.status(200).json({ message: 'Delivery updated successfully', delivery: updatedDelivery });
    } catch (error) {
        logger.error(`[DELIVERY SERVICE] Error updating delivery: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
