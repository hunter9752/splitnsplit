const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Deal = require('../models/Deal');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendPaymentConfirmationEmail } = require('../utils/emailService');

// @route   POST api/payments/:dealId
// @desc    Process payment for a deal
// @access  Private
router.post('/:dealId', auth, async (req, res) => {
  const {
    paymentMethod,
    transactionId,
    address
  } = req.body;

  try {
    // Validate input
    if (!paymentMethod || !address) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    if (paymentMethod !== 'cod' && !transactionId) {
      return res.status(400).json({ msg: 'Transaction ID is required for online payments' });
    }

    // Validate address
    if (!address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ msg: 'Please provide a complete address' });
    }

    // Get deal info
    const deal = await Deal.findById(req.params.dealId);
    
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Check if user is part of this deal
    const user = await User.findById(req.user.id);
    
    const joinedDealIndex = user.joinedDeals.findIndex(
      joinedDeal => joinedDeal.deal.toString() === req.params.dealId
    );
    
    if (joinedDealIndex === -1) {
      return res.status(400).json({ msg: 'You have not joined this deal' });
    }

    // Check if payment already processed
    const existingPayment = await Payment.findOne({
      user: req.user.id,
      deal: req.params.dealId
    });
    
    if (existingPayment) {
      return res.status(400).json({ msg: 'Payment already processed for this deal' });
    }

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      deal: req.params.dealId,
      amount: deal.splitPrice,
      paymentMethod,
      transactionId: transactionId || 'COD',
      status: paymentMethod === 'cod' ? 'pending' : 'completed',
      address
    });

    await payment.save();

    // Update user's address if not set
    if (!user.address) {
      user.address = address;
      await user.save();
    }

    // Update user's joined deal status
    if (paymentMethod !== 'cod') {
      user.joinedDeals[joinedDealIndex].status = 'active';
      await user.save();

      // Update deal participant status
      const participantIndex = deal.participants.findIndex(
        participant => participant.user.toString() === req.user.id
      );
      
      if (participantIndex !== -1) {
        deal.participants[participantIndex].status = 'active';
        await deal.save();
      }
    }

    // Send confirmation email
    await sendPaymentConfirmationEmail(user.email, payment, deal, user.name);

    res.json({
      msg: 'Payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        invoiceNumber: payment.invoiceNumber
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/payments/user
// @desc    Get all payments made by user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('deal', 'name brand category image')
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('deal', 'name brand category image originalPrice splitPrice duration')
      .populate('user', 'name email');
    
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    // Check if payment belongs to user
    if (payment.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/payments/:id
// @desc    Update payment status (admin only)
// @access  Private (would require admin middleware)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    
    payment.status = status;
    
    if (status === 'refunded') {
      payment.refundDate = Date.now();
    }
    
    await payment.save();
    
    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router; 