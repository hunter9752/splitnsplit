const express = require('express');
const connectDB = require('./db');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Initialize middleware
app.use(express.json({ extended: false }));

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5001', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'x-auth-token']
}));

// Define API routes first
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/admin', require('./routes/admin'));

// Then serve static assets
app.use(express.static(path.join(__dirname, '../')));

// Handle all other routes
app.get('*', (req, res) => {
    // Only send index.html for non-API routes
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.resolve(__dirname, '../', 'index.html'));
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('MongoDB URI:', process.env.MONGO_URI);
}); 