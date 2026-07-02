const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept network requests to inspect responses
  await page.setRequestInterception(true);
  page.on('request', request => {
    request.continue();
  });
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/Pharmacist/login') || url.includes('/api/auth/me')) {
      console.log(`[Response] ${url} | Status: ${response.status()}`);
      console.log(response.headers());
    }
  });

  const email = 'test' + Date.now() + '@test.com';

  console.log('Navigating to register page...');
  await page.goto('https://serviceapotheke.tech/register/pharmacist', { waitUntil: 'networkidle2' });

  console.log('Filling step 1...');
  // Wait for inputs
  await page.waitForSelector('input[type="text"]');
  const inputs = await page.$$('input');
  
  // fullName, email, password
  await inputs[0].type('Test User Puppeteer');
  await inputs[1].type(email);
  await inputs[2].type('Password123!');

  // Click next (button with text Weiter or right arrow)
  // There are two buttons at bottom usually
  const buttons = await page.$$('button');
  await buttons[buttons.length - 1].click();

  console.log('Filling step 2...');
  await page.waitForTimeout(1000); // Wait for transition
  const step2Buttons = await page.$$('button');
  await step2Buttons[step2Buttons.length - 1].click();

  console.log('Filling step 3 (Submit)...');
  await page.waitForTimeout(1000);
  
  // Click Registrierung abschließen
  const submitButtons = await page.$$('button');
  // Usually the last button
  await submitButtons[submitButtons.length - 1].click();

  console.log('Waiting for navigation...');
  // Wait to see if it redirects to dashboard or login
  await page.waitForTimeout(5000);

  const currentUrl = page.url();
  console.log('Ended up at:', currentUrl);

  const cookies = await page.cookies();
  console.log('Cookies in browser:', cookies);

  await browser.close();
})();
