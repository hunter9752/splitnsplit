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
    
    // Import User model
    const User = require('./models/User');
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('No users found in the database.');
      console.log('Users are not being added correctly.');
    } else {
      // Fetch all users
      const users = await User.find().select('-password').lean();
      
      console.log(`Found ${users.length} users:`);
      console.log('====================');
      
      // Print user summaries
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`Name: ${user.name || 'Not provided'}`);
        console.log(`Email: ${user.email}`);
        console.log(`Username: ${user.username || 'Not provided'}`);
        console.log(`Phone: ${user.phone || 'Not provided'}`);
        console.log(`Is Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
        console.log(`Joined Deals Count: ${user.joinedDeals ? user.joinedDeals.length : 0}`);
        console.log('====================');
      });
    }
    
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