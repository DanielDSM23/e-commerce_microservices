const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true
    },
    deliveryStatus: {
        type: String,
        required: true,
        enum: ["pending", "in-transit", "delivered"],
        default: "pending",
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
    },
    deliveryDate: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Delivery", deliverySchema);
