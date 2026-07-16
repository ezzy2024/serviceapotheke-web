import { test, expect } from '@playwright/test';

test('Take specific screenshots', async ({ page }) => {
  await page.goto('https://serviceapotheke.tech/login');
  await page.fill('input[name="email"]', 'test_1784222663522@web-library.net');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button:has-text("Einloggen")');
  
  await page.waitForURL('**/dashboard/pharmacy*');
  await page.screenshot({ path: 'pharmacy_dashboard_no_inventar.png', fullPage: true });

  await page.click('a[href="/dashboard/pharmacy/pdl"]');
  await page.waitForURL('**/dashboard/pharmacy/pdl*');
  
  // Click the "AMTS-Analyse starten" button
  await page.click('button:has-text("AMTS-Analyse starten")');
  
  // Wait for the modal to appear
  await page.waitForSelector('text=Coming Soon');
  
  await page.screenshot({ path: 'pharmacy_amts_modal.png' });
});
