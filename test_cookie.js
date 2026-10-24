async function run() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password' })
    });
    
    console.log("Login Status:", loginRes.status);
    
    const setCookie = loginRes.headers.get('set-cookie');
    console.log("Set-Cookie Header:", setCookie);
    
    if (setCookie) {
      const tokenCookie = setCookie.split(';')[0];
      const meRes = await fetch('http://localhost:5000/api/v1/auth/me', {
        headers: {
          'Cookie': tokenCookie
        }
      });
      const meData = await meRes.json();
      console.log("Auth Me Status:", meRes.status);
      console.log("Auth Me Data:", meData);
    }
  } catch (err) {
    console.error(err);
  }
}
run();
