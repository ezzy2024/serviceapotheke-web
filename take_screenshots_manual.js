const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  const artifactDir = 'C:/Users/ezzel/.gemini/antigravity/brain/b0be1aab-3321-4ff6-8f1a-b1af47672daf';
  
  // 1. Ueber uns
  await page.goto('http://localhost:3000/ueber-uns');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_ueber_uns.png`, fullPage: true });
  console.log('Took screenshot: ueber-uns');

  // 2. Fuer apotheken
  await page.goto('http://localhost:3000/fuer-apotheken');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_fuer_apotheken.png`, fullPage: true });
  console.log('Took screenshot: fuer-apotheken');

  // 3. Login
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_login.png`, fullPage: true });
  console.log('Took screenshot: login');

  // 4. Register Pharmacist - click through steps
  await page.goto('http://localhost:3000/register/pharmacist');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_register_pharmacist_step1.png`, fullPage: true });
  console.log('Took screenshot: register pharmacist step 1');

  // Fill pharmacist step 1
  await page.fill('input[name="firstName"]', 'Max');
  await page.fill('input[name="lastName"]', 'Mustermann');
  await page.fill('input[name="email"]', 'max@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.fill('input[name="confirmPassword"]', 'Password123!');
  await page.fill('input[name="street"]', 'Teststraße');
  await page.fill('input[name="houseNumber"]', '1');
  await page.fill('input[name="postalCode"]', '12345');
  await page.fill('input[name="city"]', 'Berlin');
  
  await page.click('button:has-text("Weiter")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_register_pharmacist_step2.png`, fullPage: true });
  console.log('Took screenshot: register pharmacist step 2');

  await page.click('button:has-text("Weiter")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_register_pharmacist_step3.png`, fullPage: true });
  console.log('Took screenshot: register pharmacist step 3');

  // 5. Register Pharmacy - click through steps
  await page.goto('http://localhost:3000/register/pharmacy');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_register_pharmacy_step1.png`, fullPage: true });
  console.log('Took screenshot: register pharmacy step 1');

  // The fields should be immediately visible because we removed the search logic!
  await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  await page.fill('input[name="email"]', 'apotheke@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.fill('input[name="confirmPassword"]', 'Password123!');
  await page.fill('input[name="street"]', 'Apothekenstraße');
  await page.fill('input[name="houseNumber"]', '2');
  await page.fill('input[name="postalCode"]', '54321');
  await page.fill('input[name="city"]', 'Hamburg');

  await page.click('button:has-text("Weiter")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/screenshot_register_pharmacy_step2.png`, fullPage: true });
  console.log('Took screenshot: register pharmacy step 2');
  
  await page.fill('input[name="licenseNumber"]', 'IK123456789');
  await page.click('button:has-text("Weiter")');
  await page.waitForTimeout(1000);
  
  // Did it increment correctly? 
  await page.screenshot({ path: `${artifactDir}/screenshot_register_pharmacy_step3.png`, fullPage: true });
  console.log('Took screenshot: register pharmacy step 3');
  
  await browser.close();
})();
