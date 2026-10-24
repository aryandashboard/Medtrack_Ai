const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('http://localhost:3000/login');
  await page.type('#email', 'test@test.com');
  await page.type('#password', 'password');
  
  console.log("Clicking submit");
  await page.click('button[type="submit"]');
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
