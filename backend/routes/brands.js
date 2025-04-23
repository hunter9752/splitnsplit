const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const auth = require('../middleware/auth');

// @route   GET api/brands
// @desc    Get all brands (unique brands from deals)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Fetch unique brands from the deals collection
    const brands = await Deal.aggregate([
      { $group: { 
        _id: '$brand', 
        name: { $first: '$brand' },
        deals: { $push: '$$ROOT' },
        dealsCount: { $sum: 1 },
        avgSavings: { $avg: { $divide: [{ $subtract: ['$originalPrice', '$splitPrice'] }, '$originalPrice'] } }
      }},
      { $project: {
        _id: 1,
        name: 1,
        dealsCount: 1,
        avgSavings: 1,
        category: { $first: '$deals.category' },
        image: { $first: '$deals.image' },
        description: { $first: '$deals.description' }
      }},
      { $sort: { dealsCount: -1 } }
    ]);
    
    res.json(brands);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/brands/:id
// @desc    Get brand by ID (name)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const brandName = req.params.id;
    
    // Find one deal to get brand details
    const brandDeal = await Deal.findOne({ brand: brandName });
    
    if (!brandDeal) {
      return res.status(404).json({ msg: 'Brand not found' });
    }
    
    // Count total deals for this brand
    const dealsCount = await Deal.countDocuments({ brand: brandName });
    
    // Get average savings for this brand
    const savingsData = await Deal.aggregate([
      { $match: { brand: brandName } },
      { $group: { 
        _id: null,
        avgSavings: { $avg: { $divide: [{ $subtract: ['$originalPrice', '$splitPrice'] }, '$originalPrice'] } }
      }}
    ]);
    
    const avgSavings = savingsData.length > 0 ? savingsData[0].avgSavings : 0;
    
    // Construct brand object
    const brand = {
      id: brandName,
      name: brandName,
      category: brandDeal.category,
      description: brandDeal.description || `Subscribe to ${brandName} at discounted rates by sharing with others.`,
      logo: brandDeal.image || `/images/BRANDS/${brandName.toUpperCase()}/logo.png`,
      bannerImage: `/images/BRANDS/${brandName.toUpperCase()}/banner.jpg`,
      website: brandDeal.website || '#',
      dealsCount,
      avgSavings,
      avgRating: 4.5, // Mock rating
      features: brandDeal.features || [
        'Genuine subscriptions',
        'Secure sharing',
        'Reliable service',
        'Save up to 80%'
      ]
    };
    
    res.json(brand);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/brands/:id/deals
// @desc    Get all deals for a specific brand
// @access  Public
router.get('/:id/deals', async (req, res) => {
  try {
    const brandName = req.params.id;
    
    const deals = await Deal.find({ brand: brandName }).sort({ createdAt: -1 });
    
    if (!deals || deals.length === 0) {
      return res.status(404).json({ msg: 'No deals found for this brand' });
    }
    
    res.json(deals);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/brands/category/:category
// @desc    Get all brands in a specific category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    // Fetch unique brands from the deals collection for this category
    const brands = await Deal.aggregate([
      { $match: { category } },
      { $group: { 
        _id: '$brand', 
        name: { $first: '$brand' },
        deals: { $push: '$$ROOT' },
        dealsCount: { $sum: 1 },
        avgSavings: { $avg: { $divide: [{ $subtract: ['$originalPrice', '$splitPrice'] }, '$originalPrice'] } }
      }},
      { $project: {
        _id: 1,
        name: 1,
        dealsCount: 1,
        avgSavings: 1,
        category: { $first: '$deals.category' },
        image: { $first: '$deals.image' },
        description: { $first: '$deals.description' }
      }},
      { $sort: { dealsCount: -1 } }
    ]);
    
    res.json(brands);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router; 