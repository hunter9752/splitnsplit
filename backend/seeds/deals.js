const mongoose = require('mongoose');
const Deal = require('../models/Deal');

const deals = [
    {
        brand: "Netflix",
        title: "Netflix Premium Subscription",
        description: "Get Netflix Premium with 4K streaming and 4 screens at a discounted price",
        category: "Entertainment",
        image: "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Objects/Television.png",
        plans: [
            {
                name: "Premium Monthly",
                badge: "Most Popular",
                price: "199",
                originalPrice: "649",
                savings: "450",
                features: [
                    "4K + HDR Streaming",
                    "4 Screens",
                    "Ad-free Experience",
                    "Mobile + TV + Laptop"
                ],
                currentMembers: 2,
                maxMembers: 4,
                status: "filling"
            }
        ],
        stats: {
            activeSplits: 120,
            rating: 4.8,
            totalSaved: 54000
        }
    },
    {
        brand: "Spotify",
        title: "Spotify Premium Family Plan",
        description: "Share Spotify Premium with family or friends and save big!",
        category: "Music",
        image: "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Objects/Musical%20Notes.png",
        plans: [
            {
                name: "Family Monthly",
                badge: "Best Value",
                price: "99",
                originalPrice: "299",
                savings: "200",
                features: [
                    "Ad-free Music",
                    "Group Session",
                    "Offline Downloads",
                    "High Quality Audio"
                ],
                currentMembers: 3,
                maxMembers: 6,
                status: "filling"
            }
        ],
        stats: {
            activeSplits: 85,
            rating: 4.7,
            totalSaved: 17000
        }
    },
    {
        brand: "Amazon Prime",
        title: "Amazon Prime Family Subscription",
        description: "Share Amazon Prime benefits including shopping, video and music",
        category: "Shopping",
        image: "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Objects/Shopping%20Cart.png",
        plans: [
            {
                name: "Annual Plan",
                badge: "Yearly Savings",
                price: "299",
                originalPrice: "1499",
                savings: "1200",
                features: [
                    "Prime Video",
                    "Prime Music",
                    "Free Delivery",
                    "Prime Gaming"
                ],
                currentMembers: 1,
                maxMembers: 3,
                status: "available"
            }
        ],
        stats: {
            activeSplits: 45,
            rating: 4.6,
            totalSaved: 54000
        }
    },
    {
        brand: "YouTube",
        title: "YouTube Premium Family",
        description: "Ad-free YouTube experience with background play and downloads",
        category: "Entertainment",
        image: "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Objects/Film%20Projector.png",
        plans: [
            {
                name: "Family Monthly",
                badge: "Hot Deal",
                price: "149",
                originalPrice: "399",
                savings: "250",
                features: [
                    "Ad-free Videos",
                    "Background Play",
                    "Video Downloads",
                    "YouTube Music"
                ],
                currentMembers: 2,
                maxMembers: 5,
                status: "filling"
            }
        ],
        stats: {
            activeSplits: 65,
            rating: 4.5,
            totalSaved: 16250
        }
    },
    {
        brand: "Hotstar",
        title: "Hotstar Premium Subscription",
        description: "Watch IPL, Movies and TV shows on Hotstar Premium",
        category: "Entertainment",
        image: "https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Objects/Crystal%20Ball.png",
        plans: [
            {
                name: "Premium Monthly",
                badge: "IPL Special",
                price: "149",
                originalPrice: "299",
                savings: "150",
                features: [
                    "4K Streaming",
                    "All Cricket Matches",
                    "Disney+ Content",
                    "Ad-free Shows"
                ],
                currentMembers: 1,
                maxMembers: 4,
                status: "available"
            }
        ],
        stats: {
            activeSplits: 95,
            rating: 4.4,
            totalSaved: 14250
        }
    }
];

async function seedDeals() {
    try {
        // Connect to MongoDB with proper options
        await mongoose.connect('mongodb://localhost:27017/jj_database', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing deals
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Insert new deals
        const createdDeals = await Deal.insertMany(deals);
        console.log('Added new deals:', createdDeals);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error seeding deals:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDeals(); 