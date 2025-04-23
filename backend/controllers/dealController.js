const Deal = require('../models/Deal');
const Participant = require('../models/Participant');
const User = require('../models/User');

// @desc    Join a deal
// @route   POST /api/deals/join
// @access  Public
exports.joinDeal = async (req, res) => {
  try {
    const { dealId, planName, userData } = req.body;

    // Find the deal
    const deal = await Deal.findById(dealId);
    
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }

    // Find the specific plan
    const selectedPlan = deal.plans.find(p => p.name === planName);
    
    if (!selectedPlan) {
      return res.status(404).json({ msg: 'Plan not found' });
    }

    // Check if plan is full
    if (selectedPlan.currentMembers >= selectedPlan.maxMembers) {
      return res.status(400).json({ msg: 'This plan is currently full' });
    }

    // Check if user exists, otherwise create
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
      user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address
      });
      await user.save();
    }

    // Check if user already joined this plan
    const existingParticipant = await Participant.findOne({
      user: user._id,
      deal: deal._id,
      planName: planName
    });

    if (existingParticipant) {
      return res.status(400).json({ msg: 'You have already joined this plan' });
    }

    // Create participant record
    const participant = new Participant({
      user: user._id,
      deal: deal._id,
      planName: planName,
      status: 'pending',
      joinedAt: new Date()
    });

    await participant.save();

    // Increment current members count
    selectedPlan.currentMembers += 1;
    
    // Update plan status if needed
    if (selectedPlan.currentMembers >= selectedPlan.maxMembers) {
      selectedPlan.status = 'full';
    } else if (selectedPlan.currentMembers > 0) {
      selectedPlan.status = 'filling';
    }

    await deal.save();

    res.json({
      success: true,
      participant: {
        id: participant._id,
        status: participant.status,
        joinedAt: participant.joinedAt
      },
      plan: {
        name: selectedPlan.name,
        price: selectedPlan.price,
        status: selectedPlan.status,
        currentMembers: selectedPlan.currentMembers,
        maxMembers: selectedPlan.maxMembers
      }
    });

  } catch (err) {
    console.error('Error joining deal:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Failed to join deal. Please try again.' 
    });
  }
};

// @desc    Get all deals
// @route   GET /api/deals
// @access  Public
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get deals by category
// @route   GET /api/deals/category/:category
// @access  Public
exports.getDealsByCategory = async (req, res) => {
  try {
    const deals = await Deal.find({ category: req.params.category });
    res.json(deals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get deal by ID
// @route   GET /api/deals/:id
// @access  Public
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    res.json(deal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get participants for a deal
// @route   GET /api/deals/:id/participants
// @access  Admin only
exports.getDealParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({ deal: req.params.id })
      .populate('user', 'name email phone')
      .sort({ joinedAt: -1 });
    
    res.json(participants);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get all deals joined by user
// @route   GET /api/deals/user/joined
// @access  Private
exports.getJoinedDeals = async (req, res) => {
  try {
    const participants = await Participant.find({ user: req.user.id })
      .populate('deal')
      .sort({ joinedAt: -1 });
    
    res.json(participants);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Create a new deal
// @route   POST /api/deals
// @access  Admin only
exports.createDeal = async (req, res) => {
  try {
    const newDeal = new Deal(req.body);
    const deal = await newDeal.save();
    res.json(deal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a deal
// @route   PUT /api/deals/:id
// @access  Admin only
exports.updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    res.json(deal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Admin only
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    await deal.remove();
    res.json({ msg: 'Deal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
}; 