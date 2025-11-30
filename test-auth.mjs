/**
 * Test script for authentication endpoints
 * Run with: node test-auth.mjs
 */

const BASE_URL = 'http://localhost:3000';

async function testRegister() {
  console.log('\n=== Testing Registration ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Registration successful');
      return data;
    } else {
      console.log('❌ Registration failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log('\n=== Testing Login ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Login successful');
      return data;
    } else {
      console.log('❌ Login failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testRefresh(refreshToken) {
  console.log('\n=== Testing Token Refresh ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Token refresh successful');
      return data;
    } else {
      console.log('❌ Token refresh failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testValidation() {
  console.log('\n=== Testing Validation ===');

  // Test missing email
  console.log('\nTest 1: Missing email');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'password123' })
    });
    const data = await response.json();
    console.log('Status:', response.status, data.statusMessage || data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test short password
  console.log('\nTest 2: Short password');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: '123' })
    });
    const data = await response.json();
    console.log('Status:', response.status, data.statusMessage || data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test invalid credentials
  console.log('\nTest 3: Invalid login credentials');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@example.com', password: 'password123' })
    });
    const data = await response.json();
    console.log('Status:', response.status, data.statusMessage || data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Tests...');
  console.log('Make sure the dev server is running on port 3000\n');

  // Test registration
  const registerData = await testRegister();
  if (!registerData) {
    console.log('\n❌ Cannot continue tests without successful registration');
    return;
  }

  // Extract email for login test
  const testEmail = registerData.userId ? `test${Date.now()}@example.com` : 'test@example.com';

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test login with the registered user
  const loginData = await testLogin(testEmail, 'password123');
  if (!loginData) {
    console.log('\n⚠️ Login test skipped due to failure');
  }

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test refresh token
  if (registerData && registerData.refreshToken) {
    await testRefresh(registerData.refreshToken);
  }

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test validation
  await testValidation();

  console.log('\n✅ All tests completed!');
}

// Run tests
runTests().catch(console.error);

