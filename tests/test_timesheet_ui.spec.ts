import { test, expect } from '@playwright/test';
const fs = require('fs');

test('Test Umlaute and Timesheet', async ({ page }) => {
  test.setTimeout(120000);
  const creds = JSON.parse(fs.readFileSync('creds.json'));

  // 1. Pharmacy PDL Upload Test
  await page.goto('https://serviceapotheke.tech/login');
  await page.click('button:has-text("Apotheke")');
  await page.fill('input[name="email"]', creds.pharmacy.email);
  await page.fill('input[name="password"]', creds.pharmacy.password);
  await page.click('button:has-text("Einloggen")');
  await page.waitForURL('**/dashboard/pharmacy*');

  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/pdl');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="password"]', creds.pharmacy.password);
  await page.click('button:has-text("Entsperren")');
  
  await page.waitForSelector('text=Tresor Entsperren', { state: 'hidden' });

  fs.writeFileSync('dummy.xlsx', 'kdn_nr,geburt\n123,1960');
  await page.setInputFiles('input[type="file"]', 'dummy.xlsx');
  
  await page.waitForSelector('text=verschlüsselt und übertragen', { timeout: 15000 });
  await page.screenshot({ path: 'pdl_toast.png' });

  // Logout
  await page.click('button:has-text("Logout")');
  await page.waitForURL('**/login*');
  await page.waitForLoadState('networkidle');

  // 2. Pharmacist Timesheet Test
  await page.click('button:has-text("Freelancer")');
  await page.fill('input[name="email"]', creds.pharmacist.email);
  await page.fill('input[name="password"]', creds.pharmacist.password);
  await page.click('button:has-text("Einloggen")');
  await page.waitForURL('**/dashboard/pharmacist*');

  await page.goto('https://serviceapotheke.tech/dashboard/pharmacist/shifts');
  await page.waitForLoadState('networkidle');

  await page.click('button:has-text("Schicht abschließen")');
  await page.waitForSelector('text=Rechtliche Bestätigung (Freelancer)');

  await page.fill('input[type="time"]', '08:00');
  const timeInputs = await page.locator('input[type="time"]').all();
  await timeInputs[0].fill('08:00');
  await timeInputs[1].fill('16:00');
  await page.fill('input[type="number"]', '30');

  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("Schicht rechtsverbindlich abschließen")');
  
  await page.waitForSelector('text=erfolgreich abgeschlossen', { timeout: 15000 });
  await page.screenshot({ path: 'timesheet_success.png' });
});
