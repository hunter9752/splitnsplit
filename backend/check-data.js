const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    
    // Try to access models
    try {
      console.log('Loading User model...');
      const User = require('./models/User');
      console.log('User model loaded');
      
      console.log('Loading Deal model...');
      const Deal = require('./models/Deal');
      console.log('Deal model loaded');
      
      console.log('Loading Payment model...');
      const Payment = require('./models/Payment');
      console.log('Payment model loaded');
      
      console.log('Loading Participant model...');
      const Participant = require('./models/Participant');
      console.log('Participant model loaded');
      
      // Count documents in each collection
      console.log('Counting Users...');
      const userCount = await User.countDocuments();
      console.log('Counting Deals...');
      const dealCount = await Deal.countDocuments();
      console.log('Counting Payments...');
      const paymentCount = await Payment.countDocuments();
      console.log('Counting Participants...');
      const participantCount = await Participant.countDocuments();
      
      console.log('Database Status:');
      console.log('----------------');
      console.log(`Users: ${userCount}`);
      console.log(`Deals: ${dealCount}`);
      console.log(`Payments: ${paymentCount}`);
      console.log(`Participants: ${participantCount}`);
    } catch (modelErr) {
      console.error('Error with models:', modelErr);
    }
    
    // Close the connection after checking
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.error('Full error:', err);
  }
};

// Run the connection test
connectDB(); 