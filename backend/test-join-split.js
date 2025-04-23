const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function testJoinSplit() {
  try {
    console.log('Testing join-split API...');

    // Generate a unique email to avoid duplicates
    const randomEmail = `test${Date.now()}@example.com`;
    
    const userData = {
      username: 'TestUser',
      email: randomEmail,
      phone: '9876543210',
      address: 'Test Address, Test City, Test State, 123456',
      plan: {
        name: 'Premium Monthly',
        price: '199',
        brand: 'Netflix'
      }
    };

    console.log('Sending join-split request with data:', userData);
    
    const response = await fetch(`${API_URL}/deals/join-split`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Join split failed: ${data.message || data.error || 'Unknown error'}`);
    }
    
    console.log('Join split successful!');
    console.log('Response:', data);
    
    console.log('\nTest passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testJoinSplit(); 