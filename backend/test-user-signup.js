const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function testUserSignup() {
  try {
    console.log('Testing user signup API...');

    // Generate a unique email to avoid "user already exists" error
    const randomEmail = `test${Date.now()}@example.com`;
    
    const userData = {
      name: 'Test User',
      email: randomEmail,
      password: 'test123456',
      phone: '9876543210'
    };

    console.log('Sending signup request with data:', userData);
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Signup failed: ${data.msg || 'Unknown error'}`);
    }
    
    console.log('Signup successful!');
    console.log('Response:', data);
    
    // Now test login with the created user
    console.log('\nTesting login with the created user...');
    
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.msg || 'Unknown error'}`);
    }
    
    console.log('Login successful!');
    console.log('Response:', loginData);
    
    // Test getting user data with token
    console.log('\nTesting get user data with token...');
    
    const userResponse = await fetch(`${API_URL}/auth/user`, {
      headers: {
        'x-auth-token': loginData.token
      }
    });
    
    const userData2 = await userResponse.json();
    
    if (!userResponse.ok) {
      throw new Error(`Get user failed: ${userData2.msg || 'Unknown error'}`);
    }
    
    console.log('Get user successful!');
    console.log('User data:', userData2);
    
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testUserSignup(); 