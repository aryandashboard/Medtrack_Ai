const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`BROWSER LOG: ${msg.text()}`));
  
  // Monitor all network requests
  page.on('response', async (response) => {
    const request = response.request();
    const url = request.url();
    if (url.includes('/api/v1/')) {
      logs.push(`Network: ${request.method()} ${url} -> ${response.status()}`);
      
      const reqHeaders = request.headers();
      if (reqHeaders['cookie']) {
        logs.push(`  Sent Cookie: ${reqHeaders['cookie']}`);
      }
      
      const headers = response.headers();
      if (headers['set-cookie']) {
        logs.push(`  Set-Cookie: ${headers['set-cookie']}`);
      }
    }
  });

  await page.goto('http://localhost:3000/login');
  
  // Fake login
  await page.type('#email', 'test@test.com');
  await page.type('#password', 'password');
  
  logs.push("Clicking submit");
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
    page.click('button[type="submit"]')
  ]);
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Get all cookies
  const cookies = await page.cookies();
  logs.push(`Cookies stored in browser: ${cookies.length}`);
  for (const c of cookies) {
    logs.push(`  Cookie: ${c.name}, Domain: ${c.domain}, Path: ${c.path}, HttpOnly: ${c.httpOnly}, Secure: ${c.secure}, SameSite: ${c.sameSite}`);
  }
  
  console.log(logs.join('\n'));
  await browser.close();
})();
