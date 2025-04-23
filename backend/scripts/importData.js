const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Deal = require('../models/Deal');

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/splitnsplit';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Read deals data
const dealsData = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../data/deals.json'),
        'utf-8'
    )
);

// Import deals
async function importDeals() {
    try {
        // Clear existing deals
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Insert new deals
        const deals = await Deal.insertMany(dealsData);
        console.log(`Imported ${deals.length} deals successfully`);

        // Close connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error importing deals:', error);
        process.exit(1);
    }
}

// Run import
importDeals(); 