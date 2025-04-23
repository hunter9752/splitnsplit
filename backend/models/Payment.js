const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deal',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    default: function() {
      return this.amount * 0.18; // 18% GST
    }
  },
  totalAmount: {
    type: Number,
    default: function() {
      return this.amount + this.gst;
    }
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'cod'],
    required: true
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  invoiceNumber: {
    type: String
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date
  },
  notes: {
    type: String
  }
});

// Generate invoice number before saving
PaymentSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    // Generate a unique invoice number format: SNS-YYYYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    
    this.invoiceNumber = `SNS-${year}${month}${day}-${random}`;
  }
  next();
});

module.exports = mongoose.model('payment', PaymentSchema); 