const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const nodemailer = require('nodemailer');
const Deal = require('../models/Deal');
const User = require('../models/User');
const Razorpay = require('razorpay');
const Participant = require('../models/Participant');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   GET api/deals
// @desc    Get all deals
// @access  Public
router.get('/', dealController.getDeals);

// @route   GET api/deals/category/:category
// @desc    Get deals by category
// @access  Public
router.get('/category/:category', dealController.getDealsByCategory);

// @route   GET api/deals/:id
// @desc    Get deal by ID
// @access  Public
router.get('/:id', dealController.getDealById);

// @route   POST api/deals/join
// @desc    Join a deal
// @access  Public
router.post('/join', dealController.joinDeal);

// @route   GET api/deals/user/joined
// @desc    Get all deals joined by user
// @access  Private
router.get('/user/joined', auth, dealController.getJoinedDeals);

// @route   GET api/deals/:id/participants
// @desc    Get participants for a deal
// @access  Admin only
router.get('/:id/participants', auth, adminAuth, dealController.getDealParticipants);

// @route   POST api/deals
// @desc    Create a deal (admin only)
// @access  Private (would require admin middleware)
router.post('/', auth, dealController.createDeal);

// @route   PUT api/deals/:id
// @desc    Update a deal (admin only)
// @access  Private (would require admin middleware)
router.put('/:id', auth, dealController.updateDeal);

// @route   DELETE api/deals/:id
// @desc    Delete a deal (admin only)
// @access  Private (would require admin middleware)
router.delete('/:id', auth, dealController.deleteDeal);

// Get members count for a plan
router.get('/members-count/:planName', async (req, res) => {
    try {
        const planName = req.params.planName;
        const deal = await Deal.findOne({ 'plans.name': planName });
        
        if (!deal) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const plan = deal.plans.find(p => p.name === planName);
        const currentMembers = await User.countDocuments({
            'joinedPlan.name': planName,
            'joinedPlan.paymentStatus': 'completed'
        });

        res.json({
            currentMembers,
            maxMembers: plan.maxMembers
        });
    } catch (error) {
        console.error('Error fetching members count:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Join Split Route
router.post('/join-split', async (req, res) => {
    try {
        const { username, email, phone, address, plan } = req.body;
        console.log('Received data:', { username, email, phone, address, plan });

        // Check if plan exists, if not create a default one
        let deal = await Deal.findOne({ 'plans.name': plan.name });
        
        if (!deal) {
            console.log('Plan not found, creating a new deal for:', plan.name);
            
            // Create a new deal with this plan
            deal = new Deal({
                brand: plan.brand || 'Unknown',
                title: `${plan.brand || 'New'} Subscription`,
                description: `${plan.name} subscription sharing`,
                category: 'Streaming',
                image: '/images/deals/default.jpg',
                plans: [{
                    name: plan.name,
                    badge: 'Popular',
                    price: plan.price,
                    originalPrice: plan.price,
                    savings: '0%',
                    features: ['Full access', 'Premium quality', 'Shared subscription'],
                    currentMembers: 0,
                    maxMembers: 4,
                    status: 'available'
                }],
                stats: {
                    activeSplits: 1,
                    rating: 4.5,
                    totalSaved: 0
                }
            });
            
            await deal.save();
            console.log('Created new deal:', deal);
        }

        // Get the selected plan
        const selectedPlan = deal.plans.find(p => p.name === plan.name);
        
        // Check if the plan is full (skip this check for newly created plans)
        if (deal._id) {
            const currentMembers = await User.countDocuments({
                'joinedPlan.name': plan.name,
                'joinedPlan.paymentStatus': 'completed'
            });

            if (currentMembers >= selectedPlan.maxMembers) {
                throw new Error('Plan is full');
            }
        }

        // Create Razorpay order
        const priceStr = plan.price.toString();
        const amount = parseInt(priceStr.replace(/[^0-9]/g, '') || '100'); // Extract numbers from price, default to 100
        const currency = 'INR';
        
        // Generate a mock order ID if Razorpay is not available
        let order = { id: `order_${Date.now()}` };
        
        try {
            order = await razorpay.orders.create({
                amount: amount * 100, // Convert to paise
                currency,
                receipt: `receipt_${Date.now()}`
            });
        } catch (orderError) {
            console.error('Error creating Razorpay order, using mock order:', orderError);
        }

        // Save user data with pending status
        const user = new User({
            name: username,
            username,
            email,
            phone,
            address,
            joinedPlan: {
                name: plan.name,
                price: plan.price,
                brand: plan.brand,
                orderId: order.id,
                paymentStatus: 'pending'
            },
            joinedAt: new Date()
        });
        await user.save();
        console.log('User saved:', user);

        // Try to send email, but don't fail if email fails
        try {
            // Setup email transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Send welcome email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to Split N Split!',
                html: `
                    <h2>Welcome to Split N Split!</h2>
                    <p>Hi ${username},</p>
                    <p>Thank you for joining the ${plan.brand} - ${plan.name} split group.</p>
                    <p>Plan Details:</p>
                    <ul>
                        <li>Plan: ${plan.name}</li>
                        <li>Price: ${plan.price}</li>
                        <li>Brand: ${plan.brand}</li>
                    </ul>
                    <p>Your Details:</p>
                    <ul>
                        <li>Name: ${username}</li>
                        <li>Email: ${email}</li>
                        <li>Phone: ${phone}</li>
                        <li>Address: ${address}</li>
                    </ul>
                    <p>To complete your subscription, please make the payment using the following link:</p>
                    <a href="http://localhost:5001/payment/${order.id}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Make Payment</a>
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>Best regards,<br>Split N Split Team</p>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed, but continuing:', emailError);
        }

        // Send success response with payment details
        res.json({ 
            success: true,
            message: 'Successfully joined the split group',
            user: {
                username,
                email,
                phone,
                plan: plan.name,
                brand: plan.brand
            },
            payment: {
                orderId: order.id,
                amount: amount,
                currency: currency
            }
        });
    } catch (error) {
        console.error('Error joining split:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to join split group',
            message: error.message 
        });
    }
});

// Payment verification webhook
router.post('/payment-webhook', async (req, res) => {
    try {
        const { orderId, paymentId, signature, userData } = req.body;
        
        // Verify payment signature
        const isValid = razorpay.validateWebhookSignature(
            JSON.stringify(req.body),
            signature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (isValid) {
            // Update user payment status
            const user = await User.findOneAndUpdate(
                { 'joinedPlan.orderId': orderId },
                { 
                    $set: { 
                        'joinedPlan.paymentStatus': 'completed',
                        'joinedPlan.paymentId': paymentId
                    }
                },
                { new: true }
            );

            if (user) {
                // Send payment confirmation email
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Payment Confirmation - Split N Split',
                    html: `
                        <h2>Payment Successful!</h2>
                        <p>Hi ${user.username},</p>
                        <p>Your payment for ${user.joinedPlan.brand} - ${user.joinedPlan.name} has been confirmed.</p>
                        <p>Payment Details:</p>
                        <ul>
                            <li>Amount: ${user.joinedPlan.price}</li>
                            <li>Payment ID: ${paymentId}</li>
                            <li>Date: ${new Date().toLocaleDateString()}</li>
                        </ul>
                        <p>Your Account Details:</p>
                        <ul>
                            <li>Username: ${user.username}</li>
                            <li>Email: ${user.email}</li>
                            <li>Phone: ${user.phone}</li>
                        </ul>
                        <p>You can now start using your subscription!</p>
                        <p>Thank you for choosing Split N Split!</p>
                    `
                });

                // Update deal members count
                await Deal.updateOne(
                    { 'plans.name': user.joinedPlan.name },
                    { $inc: { 'plans.$.currentMembers': 1 } }
                );
            }

            res.json({ success: true });
        } else {
            throw new Error('Invalid payment signature');
        }
    } catch (error) {
        console.error('Payment webhook error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Reset members for a plan
router.post('/reset-members/:planName', async (req, res) => {
    try {
        const planName = req.params.planName;
        
        // Find the deal with this plan
        const deal = await Deal.findOne({ 'plans.name': planName });
        if (!deal) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        // Reset members count for this plan
        await Deal.updateOne(
            { 'plans.name': planName },
            { $set: { 'plans.$.currentMembers': 0 } }
        );

        // Update user statuses
        await User.updateMany(
            { 'joinedPlan.name': planName },
            { 
                $set: { 
                    'joinedPlan.paymentStatus': 'completed',
                    'joinedPlan.groupCompleted': true
                }
            }
        );

        // Send completion emails to all users in the group
        const usersInGroup = await User.find({ 
            'joinedPlan.name': planName,
            'joinedPlan.paymentStatus': 'completed'
        });

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send emails to all users
        for (const user of usersInGroup) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your Split Group is Complete!',
                html: `
                    <h2>Congratulations! Your Split Group is Complete</h2>
                    <p>Hi ${user.username},</p>
                    <p>Your split group for ${user.joinedPlan.brand} - ${user.joinedPlan.name} is now complete!</p>
                    <p>Group Details:</p>
                    <ul>
                        <li>Plan: ${user.joinedPlan.name}</li>
                        <li>Price: ${user.joinedPlan.price}</li>
                        <li>Brand: ${user.joinedPlan.brand}</li>
                    </ul>
                    <p>Thank you for being part of Split N Split!</p>
                `
            });
        }

        res.json({ 
            success: true, 
            message: 'Group reset successfully',
            usersNotified: usersInGroup.length
        });

    } catch (error) {
        console.error('Error resetting members:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset group members',
            error: error.message 
        });
    }
});

// Host a new split/deal
router.post('/host-split', async (req, res) => {
    try {
        const { 
            dealType, 
            dealName, 
            dealCategory, 
            dealPrice, 
            dealCycle, 
            dealDescription,
            groupName,
            groupSize,
            groupDescription,
            closingDate,
            paymentMethod,
            paymentCycle,
            additionalInfo,
            hostInfo
        } = req.body;

        console.log('Received host deal data:', req.body);

        // Always use customer provided name if available, no matter how empty it seems
        // Only use anonymous host if there's literally no username value
        const hostUsername = hostInfo?.username === undefined ? 'Anonymous_Host' : hostInfo.username;
        const hostEmail = hostInfo?.email || `host_${Date.now()}@example.com`;
        const hostPhone = hostInfo?.phone || '';
        const hostAddress = hostInfo?.address || '';

        // Use customer provided values for brand and deal name
        let brandName;
        if (dealType === 'existing' && dealName) {
            brandName = dealName.split(' ')[0];
        } else if (groupName) {
            brandName = groupName.split(' ')[0];
        } else if (hostUsername && hostUsername !== 'Anonymous_Host') {
            brandName = hostUsername + '_group';
        } else {
            brandName = 'Custom';
        }
        
        // Use customer data for deal name
        const finalDealName = dealName || groupName || (hostUsername !== 'Anonymous_Host' ? hostUsername + '_subscription' : 'Custom Subscription');
        const finalCategory = dealCategory || 'other';
        const finalPrice = dealPrice || '200';
        
        try {
            // Try to create new deal object
            const newDeal = new Deal({
                brand: brandName,
                title: groupName || (hostUsername !== 'Anonymous_Host' ? hostUsername + '_group' : 'Custom Group'),
                description: groupDescription || finalDealName + ' subscription sharing',
                category: finalCategory,
                image: `/images/BRANDS/${finalCategory.toUpperCase()}/default.jpg`,
                plans: [{
                    name: finalDealName,
                    badge: 'New',
                    price: `₹${finalPrice}`,
                    originalPrice: `₹${finalPrice}`,
                    savings: '0%',
                    features: dealDescription ? dealDescription.split('\n') : ['Premium subscription'],
                    currentMembers: 1, // Host is first member
                    maxMembers: parseInt(groupSize) || 2,
                    status: 'available'
                }],
                stats: {
                    activeSplits: 1,
                    rating: 5.0,
                    totalSaved: 0
                },
                hostInfo: {
                    username: hostUsername,
                    email: hostEmail,
                    phone: hostPhone,
                    paymentMethod: paymentMethod || 'platform',
                    paymentCycle: paymentCycle || 'advance',
                    additionalInfo: additionalInfo || ''
                },
                createdAt: new Date(),
                closingDate: closingDate ? new Date(closingDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 1 week
            });

            // Save the deal
            await newDeal.save();
            console.log('Hosted new deal saved:', newDeal);

            // Create host as first member - regardless of whether they provided email or not
            // Create user with customer provided info
            let user = new User({
                name: hostUsername,
                username: hostUsername,
                email: hostEmail,
                phone: hostPhone,
                address: hostAddress,
                joinedPlan: {
                    name: finalDealName,
                    price: `₹${finalPrice}`,
                    brand: brandName,
                    paymentStatus: 'completed',
                    isHost: true
                },
                joinedAt: new Date()
            });
            
            await user.save();
            console.log('Host user saved:', user);
            
            // Create participant entry
            const participant = new Participant({
                user: user._id,
                deal: newDeal._id,
                planName: finalDealName,
                status: 'active',
                joinedAt: new Date(),
                isHost: true,
                paymentDetails: {
                    amount: parseInt(finalPrice || '0'),
                    status: 'completed'
                }
            });
            
            await participant.save();
            console.log('Participant entry created:', participant);

            res.json({
                success: true,
                message: 'New split group created successfully',
                dealId: newDeal._id
            });
        } catch (dealError) {
            console.error('Error creating deal:', dealError);
            
            // If deal creation fails, still create participant entry
            console.log('Creating participant entry without deal...');
            
            // Create user with default or provided info
            let user = new User({
                name: hostUsername,
                username: hostUsername,
                email: hostEmail,
                phone: hostPhone,
                address: hostAddress,
                joinedPlan: {
                    name: finalDealName,
                    price: `₹${finalPrice}`,
                    brand: brandName,
                    paymentStatus: 'completed',
                    isHost: true
                },
                joinedAt: new Date()
            });
            
            await user.save();
            console.log('Host user saved without deal:', user);
            
            // Create standalone participant entry
            const participant = new Participant({
                user: user._id,
                planName: finalDealName,
                status: 'pending',
                joinedAt: new Date(),
                isHost: true,
                hostDetails: {
                    groupName: groupName || (hostUsername !== 'Anonymous_Host' ? hostUsername + '_group' : 'Custom Group'),
                    groupSize: parseInt(groupSize) || 2,
                    groupDescription: groupDescription || finalDealName + ' subscription',
                    category: finalCategory,
                    price: `₹${finalPrice}`,
                    paymentMethod: paymentMethod || 'platform',
                    paymentCycle: paymentCycle || 'advance'
                },
                paymentDetails: {
                    amount: parseInt(finalPrice || '0'),
                    status: 'pending' 
                }
            });
            
            await participant.save();
            console.log('Standalone participant entry created:', participant);
            
            res.json({
                success: true,
                message: 'Host details saved as participant',
                participantId: participant._id
            });
        }
    } catch (error) {
        console.error('Error hosting new split:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create split group',
            message: error.message
        });
    }
});

module.exports = router;