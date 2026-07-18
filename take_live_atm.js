const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto('https://serviceapotheke.tech/login');
  await page.click('button:has-text("Apotheke")');
  await page.fill('input[name="email"]', 'apotheke@example.com');
  await page.fill('input[name="password"]', 'apotheke123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // ATM Terminals
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/atm');
  
  // Wait for the modal or the ATM page to load
  await page.waitForTimeout(2000);

  // Try to unlock if modal is present
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await passwordInput.fill('admin123');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
  }
  
  // ATM Terminals unlocked
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'live_screenshot_atm_terminals.png' });

  await browser.close();
})();
