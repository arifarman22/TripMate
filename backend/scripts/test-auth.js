const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    console.log('1️⃣ Testing Signup...');
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    });
    console.log('✅ Signup successful');
    console.log('Access Token:', signupRes.data.data.accessToken.substring(0, 20) + '...');
    console.log('Refresh Token:', signupRes.data.data.refreshToken.substring(0, 20) + '...\n');

    const { accessToken, refreshToken } = signupRes.data.data;

    console.log('2️⃣ Testing Protected Route...');
    const tripsRes = await axios.get(`${BASE_URL}/trips`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Protected route accessible\n');

    console.log('3️⃣ Testing Token Refresh...');
    const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken
    });
    console.log('✅ Token refreshed successfully');
    console.log('New Access Token:', refreshRes.data.data.accessToken.substring(0, 20) + '...\n');

    console.log('4️⃣ Testing Logout...');
    await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Logout successful\n');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
