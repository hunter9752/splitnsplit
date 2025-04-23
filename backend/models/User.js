const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: false 
  },
  phone: { 
    type: String 
  },
  avatar: {
    type: String
  },
  address: {
    street: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    pincode: {
      type: String
    }
  },
  joinedDeals: [
    {
      deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'deal'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['active', 'pending', 'expired'],
        default: 'pending'
      },
      expiresAt: {
        type: Date
      }
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  joinedDeal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  joinedPlan: {
    name: String,
    price: String,
    brand: String,
    orderId: String,
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    groupCompleted: {
      type: Boolean,
      default: false
    },
    isHost: {
      type: Boolean,
      default: false
    }
  }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 