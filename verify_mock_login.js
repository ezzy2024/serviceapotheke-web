const { chromium } = require('playwright');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`[NETWORK REQ] ${request.method()} ${request.url()} | Auth: ${request.headers()['authorization'] || 'none'}`);
    }
  });

  await page.route('**/api/Pharmacy/login', route => {
    console.log("Intercepted login request. Fulfilling with mock 200 OK...");
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '123',
        pharmacyName: 'Mock Apotheke',
        token: 'MOCK_JWT_TOKEN_123',
        isPremium: false
      })
    });
  });

  console.log("Navigating to https://serviceapotheke.tech/login ...");
  await page.goto('https://serviceapotheke.tech/login', { waitUntil: 'networkidle' });
  
  await page.click('button:has-text("Apotheke")');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'Password123!');
  
  console.log("Clicking Einloggen...");
  await page.click('button:has-text("Einloggen")');
  
  await page.waitForTimeout(3000);
  
  console.log(`[FINAL URL] ${page.url()}`);
  const storedToken = await page.evaluate(() => localStorage.getItem('token'));
  console.log(`[LOCAL STORAGE] token = ${storedToken}`);

  await browser.close();
})();
