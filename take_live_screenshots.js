const { chromium } = require('playwright');
const fs = require('fs');

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

  // Screenshot Übersicht
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'live_screenshot_uebersicht.png' });

  // ATM Terminals
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/atm');
  
  // VaultUnlockModal should appear
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'live_screenshot_vault_modal.png' });

  // Unlock Vault
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Entsperren")');
  
  // ATM Terminals unlocked
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'live_screenshot_atm_terminals.png' });

  await browser.close();
})();
