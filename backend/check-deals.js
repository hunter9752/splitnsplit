const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Import Deal model
    const Deal = require('./models/Deal');
    
    // Fetch all deals
    const deals = await Deal.find().lean();
    
    console.log(`Found ${deals.length} deals:`);
    console.log('====================');
    
    // Print deal summaries
    deals.forEach((deal, index) => {
      console.log(`Deal ${index + 1}: ${deal.title || deal.brand}`);
      console.log(`Brand: ${deal.brand}`);
      console.log(`Description: ${deal.description || 'No description'}`);
      console.log(`Category: ${deal.category || 'No category'}`);
      console.log(`Plans: ${deal.plans ? deal.plans.length : 0}`);
      
      // Print plan details if available
      if (deal.plans && deal.plans.length > 0) {
        console.log('Plan details:');
        deal.plans.forEach((plan, planIndex) => {
          console.log(`  Plan ${planIndex + 1}: ${plan.name}`);
          console.log(`    Price: ${plan.price}`);
          console.log(`    Original Price: ${plan.originalPrice}`);
          console.log(`    Members: ${plan.currentMembers}/${plan.maxMembers}`);
        });
      }
      
      console.log('====================');
    });
    
    // Close the connection after checking
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    console.error('Full error:', err);
  }
};

// Run the connection test
connectDB(); 