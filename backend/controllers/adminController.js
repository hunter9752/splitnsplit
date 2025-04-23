const User = require('../models/User');
const Deal = require('../models/Deal');
const Participant = require('../models/Participant');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments();
    
    // Get total number of deals
    const totalDeals = await Deal.countDocuments();
    
    // Get total number of participants
    const totalParticipants = await Participant.countDocuments();
    
    // Get deals by status
    const openDeals = await Deal.countDocuments({ status: 'open' });
    const filledDeals = await Deal.countDocuments({ status: 'filled' });
    const completedDeals = await Deal.countDocuments({ status: 'completed' });
    const expiredDeals = await Deal.countDocuments({ status: 'expired' });
    
    // Get recent deals
    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent participants
    const recentParticipants = await Participant.find()
      .populate('user', 'name email')
      .populate('deal', 'title brand')
      .sort({ joinedAt: -1 })
      .limit(10);
    
    res.json({
      totalUsers,
      totalDeals,
      totalParticipants,
      dealStats: {
        open: openDeals,
        filled: filledDeals,
        completed: completedDeals,
        expired: expiredDeals
      },
      recentDeals,
      recentParticipants
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get all deals with participants count
// @route   GET /api/admin/deals
// @access  Admin only
exports.getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    
    // Get participant counts for each deal
    const dealsWithCounts = await Promise.all(
      deals.map(async deal => {
        const participantCount = await Participant.countDocuments({ deal: deal._id });
        return {
          ...deal.toObject(),
          participantCount
        };
      })
    );
    
    res.json(dealsWithCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get participants by deal
// @route   GET /api/admin/deals/:dealId/participants
// @access  Admin only
exports.getDealParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({ deal: req.params.dealId })
      .populate('user', 'name email phone')
      .sort({ joinedAt: -1 });
    
    res.json(participants);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Send notification to all participants of a deal
// @route   POST /api/admin/deals/:dealId/notify
// @access  Admin only
exports.notifyDealParticipants = async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ msg: 'Subject and message are required' });
    }
    
    // Get the deal
    const deal = await Deal.findById(req.params.dealId);
    
    if (!deal) {
      return res.status(404).json({ msg: 'Deal not found' });
    }
    
    // Get all participants
    const participants = await Participant.find({ deal: req.params.dealId })
      .populate('user', 'name email');
    
    if (participants.length === 0) {
      return res.status(404).json({ msg: 'No participants found for this deal' });
    }
    
    // In a real implementation, this would send emails to all participants
    // For now, we just return success with the participants that would be notified
    
    res.json({
      success: true,
      notifiedUsers: participants.map(p => ({
        name: p.user.name,
        email: p.user.email
      })),
      deal: {
        title: deal.title,
        brand: deal.brand
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
}; 