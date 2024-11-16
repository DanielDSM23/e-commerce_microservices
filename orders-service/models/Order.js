const mongoose = require('mongoose');


const CommandItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const CommandSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    items: [CommandItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(value) {
                return !isNaN(value) && value > 0;
            },
            message: 'Price must be a positive number'
        }
    }
});


module.exports = mongoose.model('Order', CommandSchema);