const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    console.log('Trying to connect to MongoDB using URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Connection database name:', conn.connection.name);
    console.log('Is MongoDB storing data?', 'If the connection is successful, yes it is able to store data.');
    
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