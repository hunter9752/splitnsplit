const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apply auth and adminAuth middleware to all routes
router.use(auth, adminAuth);

// @route   GET api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin only
router.get('/stats', adminController.getDashboardStats);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', adminController.getAllUsers);

// @route   GET api/admin/deals
// @desc    Get all deals with participants count
// @access  Admin only
router.get('/deals', adminController.getAllDeals);

// @route   GET api/admin/deals/:dealId/participants
// @desc    Get participants by deal
// @access  Admin only
router.get('/deals/:dealId/participants', adminController.getDealParticipants);

// @route   POST api/admin/deals/:dealId/notify
// @desc    Send notification to all participants of a deal
// @access  Admin only
router.post('/deals/:dealId/notify', adminController.notifyDealParticipants);

module.exports = router; 