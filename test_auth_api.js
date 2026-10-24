async function testAuth() {
  console.log('--- DIRECT API TEST ---');
  const tempEmail = 'agent_test_temp_' + Date.now() + '@example.com';
  const password = 'TestPassword123!';
  const API = 'http://localhost:5000/api/v1/auth';

  try {
    // 1. Test Register
    console.log('\n[REGISTER]');
    const regRes = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Agent Temp', email: tempEmail, password, role: 'patient' })
    });
    
    console.log(`HTTP status = ${regRes.status}`);
    const regData = await regRes.json();
    console.log(`Response body error:`, regData.error || 'None');
    console.log(`Cookies returned:`, regRes.headers.getSetCookie ? (regRes.headers.getSetCookie().length > 0 ? 'YES' : 'NO') : 'Unknown');
    
    if (!regRes.ok) {
      console.log('Register failed, aborting login test');
      return;
    }

    // 2. Test Login
    console.log('\n[LOGIN]');
    const loginRes = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: tempEmail, password })
    });

    console.log(`HTTP status = ${loginRes.status}`);
    const loginData = await loginRes.json();
    console.log(`Response body error:`, loginData.error || 'None');
    console.log(`Cookies returned:`, loginRes.headers.getSetCookie ? (loginRes.headers.getSetCookie().length > 0 ? 'YES' : 'NO') : 'Unknown');

    if (loginRes.ok && loginRes.headers.getSetCookie) {
      const cookies = loginRes.headers.getSetCookie();
      console.log('Cookie details:');
      cookies.forEach(c => console.log('  ' + c));
    }

  } catch (err) {
    console.error('Test error:', err);
  }
}

testAuth();
