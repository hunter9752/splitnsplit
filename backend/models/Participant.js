const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: false // Now optional to support standalone participants
    },
    planName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'cancelled', 'expired'],
        default: 'pending'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    isHost: {
        type: Boolean,
        default: false
    },
    hostDetails: {
        groupName: String,
        groupSize: Number,
        groupDescription: String,
        category: String,
        price: String,
        paymentMethod: String,
        paymentCycle: String
    },
    paymentDetails: {
        amount: Number,
        transactionId: String,
        paidAt: Date,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    }
});

// Update compound index to prevent duplicate participation while allowing standalone hosts
participantSchema.index({ user: 1, deal: 1, planName: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Participant', participantSchema); 