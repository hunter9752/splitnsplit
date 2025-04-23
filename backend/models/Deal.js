const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: String,
    badge: String,
    price: String,
    originalPrice: String,
    savings: String,
    features: [String],
    currentMembers: {
        type: Number,
        default: 0
    },
    maxMembers: Number,
    status: {
        type: String,
        enum: ['available', 'filling', 'limited', 'full'],
        default: 'available'
    }
});

const dealSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    title: String,
    description: String,
    category: String,
    image: String,
    plans: [planSchema],
    stats: {
        activeSplits: Number,
        rating: Number,
        totalSaved: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Deal', dealSchema); 